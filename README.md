# Al Ain Pharmacy - Playwright Automation Framework

An end-to-end (E2E) test automation framework built for **Al Ain Pharmacy** (https://alainpharmacy.ae/) using **Playwright**, **JavaScript**, **Page Object Model (POM)** with **Custom Fixtures**, and **Allure Reporting**.

---

## 📁 Framework Architecture

```
AlAinPhramcy/
│
├── Base/
│   └── Basetest.js          # Browser setup, base URL navigation, and wait
│
├── Fixtures/
│   └── testFixture.js       # Custom fixtures: sharedPage (worker-scoped), page, header, loginPage, logger
│
├── Pages/                   # Page Object Model (POM) classes
│   ├── Basepage.js          # Reusable wrapper actions (click, fill, press, isVisible, getText)
│   ├── Header.js            # Header module locators and actions (promo, search, logo, cart, wishlist, etc.)
│   ├── LoginPage.js         # Login page locators and country selection actions
│   └── Footer.js            # Footer module locators (policy links, newsletter, social links, copyright)
│
├── tests/                   # Test specifications
│   ├── Header.spec.js       # Header module regression test suite (TC01 - TC08)
│   └── Footer.spec.js       # Footer module regression test suite (TC01 - TC04)
│
├── .gitignore               # Excludes node_modules and generated reports from git
├── package.json             # Project dependencies and execution scripts
├── playwright.config.js     # Config: Chromium, 1 worker, fullyParallel: false, Allure reporter
└── README.md                # Framework documentation
```

---

## ⚙️ Prerequisites

1. **Node.js**: Version 18 or above ([Download Node.js](https://nodejs.org/))
2. **Java (JRE/JDK 8+)**: Required by Allure to generate and serve reports. Check with:
   ```bash
   java -version
   ```

---

## 🚀 Installation & Setup

1. **Navigate to project directory:**
   ```bash
   cd c:\PlaywrightAutomation\AlAinPhramcy
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright browser binaries (Chromium):**
   ```bash
   npx playwright install chromium
   ```

---

## 🧪 Implemented Test Scenarios (`tests/Header.spec.js`)

All tests run in **serial mode (`mode: 'serial'`)** within the **same browser session** using a single worker:

| Test ID | Test Scenario | Description |
| :--- | :--- | :--- |
| **TC01** | Header Visibility for Guest User | Validates visibility of Top Promo Banner, Website Logo, Search Bar, Login Button, Wishlist Button, Cart Button, Upload Prescription Button, and Mega Menu navigation. |
| **TC02** | Top Promotion Banner Validation | Validates container visibility and retrieves the exact displayed promotional text (`10% Off on Your First Order`). |
| **TC03** | Website Logo Click & Redirection | Validates logo visibility, clickability (enabled state), and verifies successful redirection back to Homepage (`https://alainpharmacy.ae/`). |
| **TC04** | Search Bar Module & Keyword Redirection | Validates search text field visibility, placeholder text, clickability, typing keyword (`panadole`), search button visibility & clickability, and verifies search results URL contains the keyword. |
| **TC05** | Login Button Click & Customer Login Page | Validates login button visibility, clickability, and verifies navigation to login page with page title displaying "Customer Login". |
| **TC06** | Wishlist Button & Guest User Redirection | Validates wishlist button clickability, default count badge of 0 for guest user, and verifies redirection to Customer Login page with page title assertion. |
| **TC07** | Cart Button Click & Shopping Cart Page | Validates Cart button clickability, performs click, retrieves destination page title, and asserts it matches "Shopping Cart". |
| **TC08** | Upload Prescription Button & Alert Message | Validates Upload Prescription button clickability, verifies redirection to Customer Login page, and checks visibility of the temporary alert banner ("Please log in to Upload Prescription"). |

### Footer Module (`tests/Footer.spec.js`)

| Test ID | Scenario / Test Case | Description |
| :--- | :--- | :--- |
| **TC01** | Footer Visibility | Scrolls to footer and validates visibility of the footer container. |
| **TC02** | Top Service / Benefit Section | Validates Free Shipping, Supported 24/7, and 100% Payment Secure icons and text, directly comparing actual retrieved text against approved content. |
| **TC03** | Company Logo & Contact Info | Validates company logo visibility, click redirection to "https://alainpharmacy.ae/", back navigation, phone logo & text visibility, clickability logging, phone click opening new tab with "tel:800500800" assertion and close, and email logo/text visibility and clickability. |

---

## 💻 Test Execution Commands

### 1. Run all tests (Default)
```bash
npm test
```

### 2. Run Header tests on Chrome in Headed Mode (Browser visible)
```bash
npx playwright test tests/Header.spec.js --project=chromium --headed
```

### 3. Run tests in Debug Mode (Playwright Inspector)
```bash
npx playwright test --debug
```

### 4. Run tests with Playwright UI Mode
```bash
npx playwright test --ui
```

---

## 📊 Allure Reporting Commands

The framework is integrated with `allure-playwright`. Test executions automatically save raw result artifacts into `allure-results/`.

### 1. Generate and view Allure Report in browser (Recommended)
Generates the report from the latest test run and serves it locally:
```bash
npm run allure:serve
```

### 2. Generate a static Allure HTML report
```bash
npm run allure:generate
```

### 3. Open previously generated static report
```bash
npm run allure:open
```

---

## 🧹 Cleaning Up Old Reports & Artifacts

To remove old test results, traces, videos, and generated Allure reports before a fresh test run:

### In PowerShell:
```powershell
Remove-Item -Recurse -Force test-results, playwright-report, allure-results, allure-report -ErrorAction SilentlyContinue
```

### In Command Prompt (CMD):
```cmd
rmdir /s /q test-results playwright-report allure-results allure-report
```

---

## 📝 Key Design Highlights

- **Shared Page & Single Worker**: Configured with `workers: 1` and `fullyParallel: false`. The `sharedPage` worker fixture executes setup, navigation, and the 1-minute wait **only once**, executing all tests consecutively inside the **same browser session**.
- **Allure Step Logger**: The custom `logger` fixture outputs timestamped logs to the console and attaches structured verification details directly to each step in the Allure dashboard.
- **Page Object Model (POM)**: Tests are decoupled from UI locators through `Header.js`, `LoginPage.js`, and `Basepage.js`.
- **Failure Artifacts**: Automatically captures screenshots and retains videos only when a test fails (`screenshot: 'only-on-failure'`, `video: 'retain-on-failure'`).
