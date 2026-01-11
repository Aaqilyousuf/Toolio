const counters: Record<string, number> = {};
const histograms: Record<string, number[]> = {};

function serializeLabels(labels: Record<string, string>): string {
  const parts = Object.entries(labels).map(([k, v]) => `${k}="${v}"`);
  return parts.length ? `{${parts.join(',')}}` : '';
}

export const metrics = {
  increment(name: string, labels: Record<string, string> = {}) {
    const key = `${name}${serializeLabels(labels)}`;
    counters[key] = (counters[key] || 0) + 1;
  },

  observe(name: string, value: number, labels: Record<string, string> = {}) {
    const key = `${name}${serializeLabels(labels)}`;
    if (!histograms[key]) histograms[key] = [];
    histograms[key].push(value);
  },

  getMetrics(): string {
    let output = '';
    
    // Process counters
    for (const [key, val] of Object.entries(counters)) {
      output += `# TYPE ${key.split('{')[0]} counter\n`;
      output += `${key} ${val}\n`;
    }

    // Process histograms (simplification: just logging last value for now or sum/count if complex needed)
    // For this MVP, let's just output the last observation as a gauge for simplicity or raw values.
    // Actually, properly implementing histogram buckets in vanilla code is verbose.
    // We will output a summary: count and sum.
    for (const [key, values] of Object.entries(histograms)) {
      const name = key.split('{')[0];
      const labelStr = key.match(/\{.*\}/)?.[0] || '';
      
      const count = values.length;
      const sum = values.reduce((a, b) => a + b, 0);
      
      output += `# TYPE ${name} summary\n`;
      output += `${name}_count${labelStr} ${count}\n`;
      output += `${name}_sum${labelStr} ${sum}\n`;
    }

    return output;
  }
};
