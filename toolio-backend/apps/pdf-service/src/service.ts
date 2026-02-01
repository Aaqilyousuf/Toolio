import { createJobDir, runCommand, deleteJobDir, metrics } from '@toolio/core';
import { join } from 'path';
import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import { readdir } from 'fs/promises';

export const PdfService = {
  async merge(files: Blob[]): Promise<string> {
    const { path } = await createJobDir('pdf-service-merge');
    const inputPaths: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const p = join(path, `input-${i}.pdf`);
        await Bun.write(p, files[i]);
        inputPaths.push(p);
      }
      const outputPath = join(path, 'merged.pdf');
      const cmd = process.platform === 'win32' ? 'gswin64c' : 'gs';
      await runCommand([cmd, '-dBATCH', '-dNOPAUSE', '-q', '-sDEVICE=pdfwrite', `-sOutputFile=${outputPath}`, ...inputPaths]);
      metrics.increment('tool_usage_total', { tool: 'pdf_merge' });
      return outputPath;
    } catch (e) {
      metrics.increment('tool_error_total', { tool: 'pdf_merge' });
      deleteJobDir(path);
      throw e;
    }
  },

  async split(file: Blob, startPage: number, endPage: number): Promise<string> {
    const { path } = await createJobDir('pdf-service-split');
    const inputPath = join(path, 'input.pdf');
    const outputPath = join(path, 'split.pdf');
    try {
      await Bun.write(inputPath, file);
      const pdfBytes = await Bun.file(inputPath).arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      
      const pageIndices = [];
      for (let i = startPage - 1; i < endPage; i++) {
          if (i >= 0 && i < pdfDoc.getPageCount()) pageIndices.push(i);
      }
      
      const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach((p) => newPdf.addPage(p));
      
      const savedBytes = await newPdf.save();
      await Bun.write(outputPath, savedBytes);
      metrics.increment('tool_usage_total', { tool: 'pdf_split' });
      return outputPath;
    } catch (e) {
      deleteJobDir(path);
      throw e;
    }
  },

  async compress(file: Blob, level: string = 'screen'): Promise<string> {
    const { path } = await createJobDir('pdf-service-compress');
    const inputPath = join(path, 'input.pdf');
    const outputPath = join(path, 'compressed.pdf');
    try {
      await Bun.write(inputPath, file);
      const cmd = process.platform === 'win32' ? 'gswin64c' : 'gs';
      // -dPDFSETTINGS: /screen (72 dpi), /ebook (150 dpi), /printer (300 dpi), /prepress (300 dpi, color preserving)
      await runCommand([
        cmd, '-sDEVICE=pdfwrite', '-dCompatibilityLevel=1.4', 
        `-dPDFSETTINGS=/${level}`, '-dNOPAUSE', '-dQUIET', '-dBATCH', 
        `-sOutputFile=${outputPath}`, inputPath
      ]);
      metrics.increment('tool_usage_total', { tool: 'pdf_compress' });
      return outputPath;
    } catch (e) {
      deleteJobDir(path);
      throw e;
    }
  },

  async pdfToImages(file: Blob): Promise<string> {
    const { path } = await createJobDir('pdf-service-to-images');
    const inputPath = join(path, 'input.pdf');
    const outputPattern = join(path, 'page-%d.png');
    try {
      await Bun.write(inputPath, file);
      const cmd = process.platform === 'win32' ? 'gswin64c' : 'gs';
      await runCommand([cmd, '-sDEVICE=png16m', '-r300', '-o', outputPattern, inputPath]);
      
      const zip = new JSZip();
      const files = await readdir(path);
      for (const f of files) {
        if (f.endsWith('.png')) {
          zip.file(f, await Bun.file(join(path, f)).arrayBuffer());
        }
      }
      const zipPath = join(path, 'pages.zip');
      await Bun.write(zipPath, await zip.generateAsync({ type: 'nodebuffer' }));
      metrics.increment('tool_usage_total', { tool: 'pdf_to_images' });
      return zipPath;
    } catch (e) {
      deleteJobDir(path);
      throw e;
    }
  },

  async imagesToPdf(files: Blob[]): Promise<string> {
    const { path } = await createJobDir('pdf-service-images-to-pdf');
    const outputPath = join(path, 'images.pdf');
    try {
      const pdfDoc = await PDFDocument.create();
      for (const f of files) {
        const bytes = await f.arrayBuffer();
        let image;
        if (f.type === 'image/jpeg' || f.type === 'image/jpg') {
          image = await pdfDoc.embedJpg(bytes);
        } else if (f.type === 'image/png') {
          image = await pdfDoc.embedPng(bytes);
        } else {
          continue; // Skip unsupported
        }
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      }
      const savedBytes = await pdfDoc.save();
      await Bun.write(outputPath, savedBytes);
      metrics.increment('tool_usage_total', { tool: 'pdf_images_to_pdf' });
      return outputPath;
    } catch (e) {
      deleteJobDir(path);
      throw e;
    }
  },

  async rotate(file: Blob, rotation: number): Promise<string> {
    const { path } = await createJobDir('pdf-service-rotate');
    const inputPath = join(path, 'input.pdf');
    const outputPath = join(path, 'rotated.pdf');
    try {
      await Bun.write(inputPath, file);
      const pdfBytes = await Bun.file(inputPath).arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = pdfDoc.getPages();
      pages.forEach(p => p.setRotation(degrees(rotation)));
      const savedBytes = await pdfDoc.save();
      await Bun.write(outputPath, savedBytes);
      metrics.increment('tool_usage_total', { tool: 'pdf_rotate' });
      return outputPath;
    } catch (e) {
      deleteJobDir(path);
      throw e;
    }
  },

  async extract(file: Blob, pageIndices: number[]): Promise<string> {
    const { path } = await createJobDir('pdf-service-extract');
    const inputPath = join(path, 'input.pdf');
    const outputPath = join(path, 'extracted.pdf');
    try {
      await Bun.write(inputPath, file);
      const pdfBytes = await Bun.file(inputPath).arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const newPdf = await PDFDocument.create();
      // Adjust from 1-based to 0-based
      const zeroBasedIndices = pageIndices.map(i => i - 1).filter(i => i >= 0 && i < pdfDoc.getPageCount());
      const copiedPages = await newPdf.copyPages(pdfDoc, zeroBasedIndices);
      copiedPages.forEach(p => newPdf.addPage(p));
      const savedBytes = await newPdf.save();
      await Bun.write(outputPath, savedBytes);
      metrics.increment('tool_usage_total', { tool: 'pdf_extract' });
      return outputPath;
    } catch (e) {
      deleteJobDir(path);
      throw e;
    }
  },

  async getMetadata(file: Blob): Promise<any> {
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    return {
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle(),
      author: pdfDoc.getAuthor(),
      subject: pdfDoc.getSubject(),
      creator: pdfDoc.getCreator(),
      producer: pdfDoc.getProducer(),
      creationDate: pdfDoc.getCreationDate(),
      modificationDate: pdfDoc.getModificationDate(),
    };
  }
};
