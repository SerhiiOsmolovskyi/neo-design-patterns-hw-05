import { ReportAdapter } from "./ReportAdapter";
import { JsonReportAdapter } from "./JsonReportAdapter";
import { CsvReportAdapter } from "./CsvReportAdapter";
import { XmlReportAdapter } from "./XmlReportAdapter";
import { AnalyzerFacade } from "./AnalyzerFacade";
import * as fs from "fs";
import * as path from "path";

export class ReportManager {
  private static readonly REPORTS_DIR = "reports";

  private adapter: ReportAdapter;
  private fileExtension: string;
  private facade: AnalyzerFacade;

  constructor(format: string = "json") {
    this.initReportsDirectory();
    [this.adapter, this.fileExtension] = this.getAdapter(format);
    this.facade = new AnalyzerFacade(this.adapter);
  }

  /**
   * Створює директорію reports/, якщо вона ще не існує.
   */
  private initReportsDirectory(): void {
    if (!fs.existsSync(ReportManager.REPORTS_DIR)) {
      fs.mkdirSync(ReportManager.REPORTS_DIR);
    }
  }

  /**
   * Обирає адаптер відповідно до формату
   */
  private getAdapter(format: string): [ReportAdapter, string] {
    switch (format.toLowerCase()) {
      case "json":
        return [new JsonReportAdapter(), "json"];
      case "csv":
        return [new CsvReportAdapter(), "csv"];
      case "xml":
        return [new XmlReportAdapter(), "xml"];
      default:
        throw new Error(`❌ Unsupported format: ${format}`);
    }
  }

  /**
   * Генерує звіт, зберігає його у файл та логує результат у консоль.
   */
  public generateReport(dirPath: string): void {
    try {
      const reportContent = this.facade.generateReport(dirPath);
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileName = `report-${timestamp}.${this.fileExtension}`;
      const outputPath = path.join(ReportManager.REPORTS_DIR, fileName);

      fs.writeFileSync(outputPath, reportContent);
      console.log(`✅ Report generated successfully: ${outputPath}`);
    } catch (error) {
      console.error("❌ Error generating report:", (error as Error).message);
    }
  }
}
