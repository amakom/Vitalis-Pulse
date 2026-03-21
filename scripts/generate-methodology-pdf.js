const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, Header, Footer, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak, LevelFormat, ExternalHyperlink } = require('docx');
const fs = require('fs');

const TEAL = '14B8A6';
const DARK = '0F172A';
const GRAY = '64748B';
const LIGHT_TEAL = 'E6FAF5';
const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function heading(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    heading: level,
    spacing: { before: level === HeadingLevel.HEADING_1 ? 400 : 240, after: 200 },
    children: [new TextRun({ text, bold: true, font: 'Arial', size: level === HeadingLevel.HEADING_1 ? 32 : 26, color: DARK })],
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [new TextRun({ text, font: 'Arial', size: 22, color: opts.color || GRAY, ...opts })],
  });
}

function boldPara(label, text) {
  return new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({ text: label, font: 'Arial', size: 22, bold: true, color: DARK }),
      new TextRun({ text, font: 'Arial', size: 22, color: GRAY }),
    ],
  });
}

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 26, bold: true, font: 'Arial' },
        paragraph: { spacing: { before: 240, after: 160 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } } }],
    }],
  },
  sections: [
    // Cover page
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        new Paragraph({ spacing: { before: 3000 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: 'VITALISPULSE', font: 'Arial', size: 48, bold: true, color: TEAL })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [new TextRun({ text: 'Scoring Methodology', font: 'Arial', size: 36, color: DARK })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Real-time health scoring for Web3 projects', font: 'Arial', size: 24, color: GRAY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: 'Version 1.0 | March 2026', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'https://www.vitalispulse.xyz', font: 'Arial', size: 20, color: TEAL })],
        }),
        new Paragraph({ children: [new PageBreak()] }),
      ],
    },
    // Main content
    {
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: 'VitalisPulse Scoring Methodology', font: 'Arial', size: 18, color: GRAY, italics: true })],
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ text: 'Page ', font: 'Arial', size: 18, color: GRAY }),
              new TextRun({ children: [PageNumber.CURRENT], font: 'Arial', size: 18, color: GRAY }),
            ],
          })],
        }),
      },
      children: [
        // 1. Executive Summary
        heading('1. Executive Summary'),
        para('VitalisPulse provides free, real-time health scores (0\u2013100) for Web3 projects. The Vitalis Score is a weighted composite of five operational health dimensions, designed to give investors, community members, and project teams a transparent, data-driven view of project sustainability.'),
        para('Unlike metrics like TVL or token price that measure market sentiment, the Vitalis Score measures operational fundamentals: Can the project sustain itself? Is the team actively building? Is revenue real? Is governance functional?'),
        boldPara('Target:', ' All DeFi, infrastructure, and governance projects \u2014 with primary focus on the Arbitrum ecosystem.'),

        // 2. Score Formula
        heading('2. Score Formula'),
        para('The Vitalis Score is calculated as a weighted sum of five sub-scores, each ranging from 0\u2013100:'),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200 },
          children: [new TextRun({ text: 'Vitalis Score = (Treasury \u00D7 0.30) + (Development \u00D7 0.25) + (Community \u00D7 0.20) + (Revenue \u00D7 0.15) + (Governance \u00D7 0.10)', font: 'Arial', size: 20, bold: true, color: DARK })],
        }),

        // Weight table
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [3120, 1560, 4680],
          rows: [
            new TableRow({
              children: ['Category', 'Weight', 'Key Metrics'].map(h =>
                new TableCell({
                  borders, width: { size: h === 'Key Metrics' ? 4680 : h === 'Weight' ? 1560 : 3120, type: WidthType.DXA },
                  shading: { fill: TEAL, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: h, font: 'Arial', size: 20, bold: true, color: 'FFFFFF' })] })],
                })
              ),
            }),
            ...([
              ['Treasury Health', '30%', 'TVL, estimated runway, diversification, stablecoin ratio, burn rate'],
              ['Development Activity', '25%', 'Commits (30d), active devs, PR merge time, last push recency'],
              ['Community & Retention', '20%', 'Market cap, TVL/MCap ratio, 30d price change, holder signals'],
              ['Revenue & Sustainability', '15%', 'Monthly revenue, revenue trend, TVL scale, rev/MCap efficiency'],
              ['Governance & Security', '10%', 'Governance type, open-source repos, team size, treasury transparency'],
            ].map(([cat, weight, metrics]) =>
              new TableRow({
                children: [cat, weight, metrics].map((text, i) =>
                  new TableCell({
                    borders, width: { size: i === 2 ? 4680 : i === 1 ? 1560 : 3120, type: WidthType.DXA },
                    margins: cellMargins,
                    children: [new Paragraph({ children: [new TextRun({ text, font: 'Arial', size: 20, color: GRAY, bold: i === 1 })] })],
                  })
                ),
              })
            )),
          ],
        }),

        // 3. Data Sources
        heading('3. Data Sources'),
        para('All scoring data is derived from publicly verifiable sources. VitalisPulse never uses self-reported metrics.'),
        ...([
          ['DefiLlama', 'TVL, protocol revenue, fees, treasury size estimates. DefiLlama is the industry standard for DeFi analytics with no token incentives or listing fees.'],
          ['CoinGecko', 'Market cap, current price, ATH drawdown, 30-day price change, trading volume. Provides market context for community and treasury scoring.'],
          ['GitHub API', 'Commit history (30-day rolling), active contributor count, PR merge velocity, last push date, weekly commit patterns. Measures real development work.'],
        ]).flatMap(([name, desc]) => [
          new Paragraph({
            spacing: { before: 160, after: 80 },
            children: [new TextRun({ text: name, font: 'Arial', size: 22, bold: true, color: DARK })],
          }),
          para(desc),
        ]),

        new Paragraph({ children: [new PageBreak()] }),

        // 4. Sub-Score Details
        heading('4. Sub-Score Calculation Details'),

        // Treasury
        heading('4.1 Treasury Health (30%)', HeadingLevel.HEADING_2),
        para('Treasury health is the highest-weighted category because treasury collapse is the #1 killer of Web3 projects. When a project holds 85%+ of its treasury in its native token and that token drops 80%, the runway drops 80%.'),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'TVL size (0\u201330 points): $1B+ = 30, $100M+ = 25, $10M+ = 18, $1M+ = 10', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Revenue coverage (0\u201330 points): Monthly revenue scaled from $10K to $1M+', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'ATH resilience (0\u201320 points): Projects closer to ATH score higher (less drawdown = healthier)', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Base points (0\u201320): Market presence and TVL/revenue existence', font: 'Arial', size: 20, color: GRAY })],
        }),

        // Development
        heading('4.2 Development Activity (25%)', HeadingLevel.HEADING_2),
        para('Development activity directly measures whether a team is actively building. Dead projects stop committing code long before they announce shutdown.'),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Commit frequency (0\u201335 points): 200+ commits/30d = 35, scaled down to 5+ = 5', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Active developers (0\u201325 points): 20+ devs = 25, 2+ devs = 7', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'PR merge velocity (0\u201315 points): Faster merges indicate healthy code review process', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Last push recency (0\u201325 points): Pushed today = 25, 90+ days = 2', font: 'Arial', size: 20, color: GRAY })],
        }),

        // Community
        heading('4.3 Community & Retention (20%)', HeadingLevel.HEADING_2),
        para('Community health is measured through on-chain and market signals rather than social media followers (which are easily gamed).'),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Market cap (0\u201330 points): Reflects community buy-in and network value', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'TVL/Market cap ratio (0\u201330 points): Higher ratio = real usage vs. speculation', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 200 },
          children: [new TextRun({ text: '30d price momentum (0\u201320 points): Positive momentum indicates growing community confidence', font: 'Arial', size: 20, color: GRAY })],
        }),

        // Revenue
        heading('4.4 Revenue & Sustainability (15%)', HeadingLevel.HEADING_2),
        para('Revenue scoring evaluates whether a project generates real income that doesn\'t depend purely on token speculation.'),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Monthly revenue (0\u201340 points): $5M+ = 40, scaled down to $10K+ = 10', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Revenue trend (0\u201320 points): Month-over-month growth direction', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'TVL as business scale (0\u201320 points): Larger TVL = larger revenue potential', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Revenue efficiency (0\u201320 points): Annualized revenue / market cap ratio', font: 'Arial', size: 20, color: GRAY })],
        }),

        // Governance
        heading('4.5 Governance & Security (10%)', HeadingLevel.HEADING_2),
        para('Governance scoring is the lowest weight because governance data is the hardest to verify programmatically. As on-chain governance tooling matures, this weight will increase.'),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Governance type (0\u201330 points): On-chain Governor/Aragon = 30, Snapshot = 20', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Open-source presence (0\u201325 points): Public GitHub repos indicate transparency', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          children: [new TextRun({ text: 'Team size (0\u201320 points): Larger active dev teams indicate decentralization', font: 'Arial', size: 20, color: GRAY })],
        }),
        new Paragraph({
          numbering: { reference: 'bullets', level: 0 },
          spacing: { after: 200 },
          children: [new TextRun({ text: 'Treasury transparency (0\u201315 points): Public treasury addresses on-chain', font: 'Arial', size: 20, color: GRAY })],
        }),

        new Paragraph({ children: [new PageBreak()] }),

        // 5. Score Tiers
        heading('5. Score Tiers'),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [1872, 1872, 1872, 3744],
          rows: [
            new TableRow({
              children: ['Score Range', 'Tier', 'Color', 'Implication'].map((h, i) =>
                new TableCell({
                  borders, width: { size: [1872, 1872, 1872, 3744][i], type: WidthType.DXA },
                  shading: { fill: TEAL, type: ShadingType.CLEAR },
                  margins: cellMargins,
                  children: [new Paragraph({ children: [new TextRun({ text: h, font: 'Arial', size: 20, bold: true, color: 'FFFFFF' })] })],
                })
              ),
            }),
            ...([
              ['90\u2013100', 'Thriving', 'Emerald', 'Excellent health. Strong across all dimensions.'],
              ['70\u201389', 'Healthy', 'Teal', 'Solid fundamentals. Minor areas for improvement.'],
              ['50\u201369', 'At Risk', 'Amber', 'Showing weakness. Requires attention.'],
              ['25\u201349', 'Critical', 'Orange', 'Significant concerns. Survival uncertain.'],
              ['0\u201324', 'Terminal', 'Red', 'Minimal activity. Project appears inactive.'],
            ].map(row =>
              new TableRow({
                children: row.map((text, i) =>
                  new TableCell({
                    borders, width: { size: [1872, 1872, 1872, 3744][i], type: WidthType.DXA },
                    margins: cellMargins,
                    children: [new Paragraph({ children: [new TextRun({ text, font: 'Arial', size: 20, color: GRAY, bold: i < 2 })] })],
                  })
                ),
              })
            )),
          ],
        }),

        // 6. Anti-Gaming
        heading('6. Anti-Gaming Measures'),
        para('The Vitalis Score is designed to be resistant to manipulation:'),
        ...([
          'On-chain verification: Treasury and revenue metrics are sourced from verified on-chain data via DefiLlama. Not self-reported.',
          'Commit quality analysis: GitHub commits are filtered for substantive changes. Whitespace-only, auto-generated, and trivial commits are discounted.',
          'Rolling averages: Scores use historical rolling averages that resist short-term manipulation. Sudden metric spikes trigger anomaly weighting.',
          'Cross-validation: Each metric is cross-referenced against correlated indicators.',
          'Decay function: Scores trend toward zero if a project stops producing new data for 30+ days, preventing stale high scores.',
        ]).map(text =>
          new Paragraph({
            numbering: { reference: 'bullets', level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text, font: 'Arial', size: 20, color: GRAY })],
          })
        ),

        // 7. Limitations
        heading('7. Current Limitations & Future Improvements'),
        para('VitalisPulse v1.0 is transparent about its current limitations:'),
        ...([
          'Community metrics use market cap and price data as proxies. Future versions will incorporate real on-chain DAU/MAU and holder growth data.',
          'Treasury composition is estimated from TVL and revenue patterns. Real wallet monitoring for verified treasury addresses is planned for Q2 2026.',
          'Governance scoring relies on metadata rather than real-time vote tracking. Integration with on-chain governance frameworks (Governor, Aragon) is in development.',
          'Revenue data depends on DefiLlama coverage. Projects not indexed by DefiLlama may have incomplete revenue scores.',
        ]).map(text =>
          new Paragraph({
            numbering: { reference: 'bullets', level: 0 },
            spacing: { after: 80 },
            children: [new TextRun({ text, font: 'Arial', size: 20, color: GRAY })],
          })
        ),

        new Paragraph({ spacing: { before: 400 } }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: '\u2014', font: 'Arial', size: 24, color: TEAL })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [new TextRun({ text: 'VitalisPulse \u2014 The Heartbeat of Web3', font: 'Arial', size: 22, bold: true, color: TEAL })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'https://www.vitalispulse.xyz | @vitalispulse', font: 'Arial', size: 20, color: GRAY })],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('public/VitalisPulse_Scoring_Methodology_v1.0.docx', buffer);
  console.log('Generated: public/VitalisPulse_Scoring_Methodology_v1.0.docx');
});
