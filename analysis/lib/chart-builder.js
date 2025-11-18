/**
 * Chart Builder for Chart.js visualizations
 * Creates beautiful, interactive charts with consistent styling
 */

export class ChartBuilder {
  
  /**
   * Default theme colors matching the app's aesthetic
   */
  static colors = {
    primary: '#00ff88',
    secondary: '#00ccff',
    warning: '#ffaa00',
    error: '#ff5555',
    purple: '#ff00ff',
    lime: '#88ff00',
    orange: '#ff8800',
    cyan: '#00ffff',
    background: 'rgba(0, 255, 136, 0.1)',
    grid: 'rgba(0, 255, 136, 0.1)',
    text: '#e6f3ec'
  };
  
  /**
   * Build a line chart configuration
   */
  static buildLineChart(data, options = {}) {
    const defaults = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace',
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: this.colors.primary,
          bodyColor: this.colors.text,
          borderColor: this.colors.primary,
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y.toFixed(3);
              }
              return label;
            }
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x'
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true
            },
            mode: 'x',
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: this.colors.grid,
            drawBorder: false
          },
          ticks: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace',
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: this.colors.grid,
            drawBorder: false
          },
          ticks: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace',
              size: 11
            }
          }
        }
      }
    };
    
    return {
      type: 'line',
      data,
      options: this.deepMerge(defaults, options)
    };
  }
  
  /**
   * Build a bar chart configuration
   */
  static buildBarChart(data, options = {}) {
    const defaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace',
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: this.colors.primary,
          bodyColor: this.colors.text,
          borderColor: this.colors.primary,
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace',
              size: 11
            }
          }
        },
        y: {
          grid: {
            color: this.colors.grid,
            drawBorder: false
          },
          ticks: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace',
              size: 11
            }
          }
        }
      }
    };
    
    return {
      type: 'bar',
      data,
      options: this.deepMerge(defaults, options)
    };
  }
  
  /**
   * Build a scatter plot configuration
   */
  static buildScatterChart(data, options = {}) {
    const defaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace'
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleColor: this.colors.primary,
          bodyColor: this.colors.text,
          borderColor: this.colors.primary,
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: {
          type: 'linear',
          position: 'bottom',
          grid: {
            color: this.colors.grid
          },
          ticks: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace'
            }
          }
        },
        y: {
          grid: {
            color: this.colors.grid
          },
          ticks: {
            color: this.colors.text,
            font: {
              family: 'ui-mono, monospace'
            }
          }
        }
      }
    };
    
    return {
      type: 'scatter',
      data,
      options: this.deepMerge(defaults, options)
    };
  }
  
  /**
   * Generate HTML for a chart canvas
   */
  static generateChartHTML(chartId, title, height = '400px') {
    return `
      <div class="chart-container" style="position: relative; height: ${height}; margin: 20px 0;">
        <h3 class="chart-title">${title}</h3>
        <canvas id="${chartId}"></canvas>
      </div>
    `;
  }
  
  /**
   * Generate JavaScript code to initialize a chart
   */
  static generateChartInitCode(chartId, chartConfig) {
    return `
      (function() {
        const ctx = document.getElementById('${chartId}');
        if (ctx) {
          new Chart(ctx, ${JSON.stringify(chartConfig, null, 2)});
        }
      })();
    `;
  }
  
  /**
   * Generate a summary statistics card
   */
  static generateStatCard(label, value, trend = null) {
    const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
    const trendClass = trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-neutral';
    
    return `
      <div class="stat-card">
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        ${trend ? `<div class="stat-trend ${trendClass}">${trendIcon}</div>` : ''}
      </div>
    `;
  }
  
  /**
   * Generate comparison table HTML
   */
  static generateComparisonTable(headers, rows) {
    const headerHTML = headers.map(h => `<th>${h}</th>`).join('');
    const rowsHTML = rows.map(row => {
      const cells = row.map((cell, idx) => {
        const isNumeric = typeof cell === 'number';
        const formatted = isNumeric ? cell.toFixed(3) : cell;
        return `<td>${formatted}</td>`;
      }).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    
    return `
      <table class="comparison-table">
        <thead>
          <tr>${headerHTML}</tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
    `;
  }
  
  /**
   * Deep merge utility for options
   */
  static deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target))
            Object.assign(output, { [key]: source[key] });
          else
            output[key] = this.deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }
  
  static isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}

