import { randomUUID, randomInt } from 'crypto';
import { connect } from 'tls';

export class UtilitiesService {
  // Request / System Based Tools
  static getUUID(): string {
    return randomUUID();
  }

  static getRandomNumber(min: number, max: number): number {
    return randomInt(min, max + 1);
  }

  // URL & Encoding Tools
  static encodeUrl(url: string): string {
    return encodeURIComponent(url);
  }

  static decodeUrl(url: string): string {
    return decodeURIComponent(url);
  }

  // Network & Website Tools
  static async checkWebsiteStatus(url: string): Promise<{ status: number; ok: boolean }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Toolio-Status-Checker/1.0' }
      });
      return { status: response.status, ok: response.ok };
    } finally {
      clearTimeout(timeout);
    }
  }

  static async getRedirects(url: string): Promise<string[]> {
    const redirects: string[] = [];
    let currentUrl = url;
    const maxRedirects = 10;

    for (let i = 0; i < maxRedirects; i++) {
      const response = await fetch(currentUrl, {
        method: 'HEAD',
        redirect: 'manual'
      });

      const location = response.headers.get('location');
      if (!location) break;

      // Handle relative URLs
      const nextUrl = new URL(location, currentUrl).toString();
      redirects.push(nextUrl);
      currentUrl = nextUrl;
      
      if (response.status < 300 || response.status >= 400) break;
    }

    return redirects;
  }

  static async unshortenUrl(url: string): Promise<string> {
    const redirects = await this.getRedirects(url);
    return redirects.length > 0 ? redirects[redirects.length - 1] : url;
  }

  static async getHttpHeaders(url: string): Promise<Record<string, string>> {
    const response = await fetch(url, { method: 'HEAD' });
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    return headers;
  }

  static async ping(host: string, port: number = 80): Promise<{ alive: boolean; time?: number }> {
    const start = Date.now();
    try {
      const socket = await Bun.connect({
        hostname: host,
        port: port,
        socket: {
          data() {},
          open(socket) {
            socket.end();
          },
          error() {},
        }
      });
      return { alive: true, time: Date.now() - start };
    } catch (e) {
      return { alive: false };
    }
  }

  static async checkSSL(hostname: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const socket = connect(443, hostname, { servername: hostname }, () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        if (cert && Object.keys(cert).length > 0) {
          resolve({
            subject: cert.subject,
            issuer: cert.issuer,
            valid_from: cert.valid_from,
            valid_to: cert.valid_to,
            fingerprint: cert.fingerprint,
            serialNumber: cert.serialNumber
          });
        } else {
          reject(new Error('No certificate found'));
        }
      });

      socket.on('error', (err) => {
        socket.destroy();
        reject(err);
      });

      // Timeout
      socket.setTimeout(10000, () => {
        socket.destroy();
        reject(new Error('SSL check timed out'));
      });
    });
  }
}
