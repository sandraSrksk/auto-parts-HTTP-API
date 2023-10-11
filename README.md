# Inventory Data API

## Description
The Inventory Data API is designed to meet the needs of a company that relies on older inventory software, which exports product data in CSV format. The primary goal of this API is to provide a means for business partners to query the availability and pricing of specific spare parts in the company's warehouse.

### Key Features
- Automatically updates with fresh data from the daily CSV export.
- Efficiently loads large CSV files (over 600MB) into memory to keep the web server responsive.
- Filter and search for spare parts by serial number or part name, pagination and sorting.

