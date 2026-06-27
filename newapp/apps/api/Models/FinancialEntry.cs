namespace api.Models;

public class FinancialEntry
{
    public int Id { get; set; }
    public string Type { get; set; } = "Expense"; // Income or Expense
    public decimal Amount { get; set; }
    public string Category { get; set; } = string.Empty;
    public System.DateTime Date { get; set; }
    public string WorkspaceId { get; set; } = string.Empty;
}
