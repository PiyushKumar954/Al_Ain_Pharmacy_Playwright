# Al Ain Pharmacy - Playwright Automation Framework

An enterprise-grade, end-to-end (E2E) test automation framework designed and built for [**Al Ain Pharmacy**](https://alainpharmacy.ae/) using **Playwright**, **JavaScript (ES Modules)**, **Page Object Model (POM)** with **Custom Fixtures**, **Data-Driven Testing (Excel)**, and **Allure Reporting**.

---

## 📁 Framework Architecture

```
AlAinPharmacy/
│
├── .github/
│   └── workflows/
│       └── playwright.yml       # GitHub Actions CI workflow for automated testing
│
├── Base/
│   └── Basetest.js              # Base test setup, initial URL navigation, and Cloudflare wait
│
├── Fixtures/
│   └── testFixture.js           # Custom Playwright fixtures: sharedPage (worker-scoped),
│                                # page, header, loginPage, footer, and custom logger
│
├── Pages/                       # Page Object Model (POM) classes
│   ├── Basepage.js              # Base page with reusable wrapper actions (click, fill, getText, isVisible, isClickable, highlight)
│   ├── Header.js                # Header module locators and actions (promo, search, logo, cart, wishlist, upload prescription, mega menus)
│   ├── LoginPage.js             # Customer login page locators and country selection actions
│   └── Footer.js                # Comprehensive footer module (benefits, contact info, Quick Links, Help & Support, 
│                                # My Accounts, newsletter, social media, app stores, license & copyright)
│
├── TestData/
│   └── AlAin_Footer.xlsx        # Excel test data workbook containing sheets:
│                                # 'Quick Links', 'Help & Support', 'My Accounts', 'Social Media', 'App Stores'
│
├── tests/                       # Automated test suites
│   ├── Header.spec.js           # Header regression test suite (TC01 – TC08)
│   └── Footer.spec.js           # Footer regression test suite (TC01 – TC10)
│
├── Utils/                       # Utility helpers & test data providers
│   ├── dataProvider.js          # Excel data reader helpers for all footer sections
│   ├── excelReader.js           # ExcelUtility class powered by xlsx & exceljs
│   └── highlighter.js           # Real-time visual element highlighter with failure badge & screenshot capture
│
├── .gitignore                   # Git ignore file excluding node_modules, reports, and temp files
├── package.json                 # Project dependencies, devDependencies, and npm scripts
├── playwright.config.js         # Playwright configuration (Chromium, 1 worker, sequential execution, Allure reporter)
└── README.md                    # Framework documentation
```

---

## ⚙️ Prerequisites

1. **Node.js**: Version 18.x or above ([Download Node.js](https://nodejs.org/))
2. **Java (JRE/JDK 8+)**: Required by Allure CLI to generate and serve HTML reports. Verify with:
   ```powershell
   java -version
   ```

---

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```powershell
   git clone https://github.com/PiyushKumar954/Al_Ain_Pharmacy_Playwright.git
   cd Al_Ain_Pharmacy_Playwright
   ```

2. **Install project dependencies:**
   ```powershell
   npm install
   ```

3. **Install Playwright browser binaries (Chromium):**
   ```powershell
   npx playwright install chromium
   ```

---

## 🧪 Implemented Test Scenarios

### 1. Header Module (`tests/Header.spec.js`)

All header tests execute in **serial mode (`mode: 'serial'`)** within the **same browser session** using a single worker:

| Test ID | Test Scenario | Description |
| :--- | :--- | :--- |
| **TC01** | Header Visibility for Guest User | Validates visibility of Top Promo Banner, Website Logo, Search Bar, Login Button, Wishlist Button, Cart Button, Upload Prescription Button, and Mega Menu navigation. |
| **TC02** | Top Promotion Banner Validation | Validates promo banner visibility and verifies displayed text content (`10% Off on Your First Order`). |
| **TC03** | Website Logo Click & Redirection | Validates logo visibility, clickability, and verifies successful redirection back to Homepage (`https://alainpharmacy.ae/`). |
| **TC04** | Search Bar & Keyword Search | Validates search text field visibility, placeholder, typing keyword (`panadole`), search button visibility & clickability, and URL keyword assertion. |
| **TC05** | Login Button Click & Redirection | Validates login button visibility, clickability, and verifies navigation to the Customer Login page with page title assertion. |
| **TC06** | Wishlist Button & Guest User Flow | Validates wishlist button clickability, default count badge of `0` for guest users, and redirection to the Customer Login page. |
| **TC07** | Shopping Cart Button Click | Validates Cart button clickability, click navigation, and asserts destination page title matches `Shopping Cart`. |
| **TC08** | Upload Prescription Button & Redirection | Validates Upload Prescription button clickability, redirection to Customer Login page, and alert banner visibility. |

---

### 2. Footer Module (`tests/Footer.spec.js`)

Comprehensive validation covering the entire footer, benefit banners, company info, data-driven link navigation, social media icons, app store buttons, and legal sections:

| Test ID | Test Scenario | Data Source | Description |
| :--- | :--- | :--- | :--- |
| **TC01** | Footer Container Visibility | DOM | Scrolls to footer and verifies footer container visibility. |
| **TC02** | Top Service & Benefits Section | DOM | Validates *Free Shipping*, *Supported 24/7*, and *100% Payment Secure* icons and text against approved values. |
| **TC03** | Company Logo & Contact Info | DOM | Validates footer logo visibility, 15-second human verification wait, click redirection to `https://alainpharmacy.ae/`, back navigation, phone icon/text visibility, `tel:` link click, and email icon/text visibility & clickability. |
| **TC04** | Quick Links Section (Data-Driven) | Excel (`Quick Links`) | Validates section visibility, logs all item names, then iterates through Excel rows (*About Us*, *Health Guide*, *Store Locator*, *Blogs*) validating visibility, clickability, and URL navigation. |
| **TC05** | Help & Support Section (Data-Driven) | Excel (`Help & Support`) | Validates section visibility, logs items, then iterates through Excel rows (*Contact Us*, *FAQs*, *Terms and Conditions*, *Privacy Policy*) asserting visibility, clickability, and URL navigation. |
| **TC06** | My Accounts Section (Data-Driven) | Excel (`My Accounts`) | Validates section visibility, logs items, then iterates through Excel rows (*Login / Register*, *View Cart*, *My Wishlist*, *Order History*) with custom OR matcher supporting account redirects (`customer/account`). |
| **TC07** | Newsletter Subscription Section | DOM | Validates newsletter container, heading text, email input textbox, and subscribe button visibility. |
| **TC08** | Social Media Icons (Data-Driven) | Excel (`Social Media`) | Validates social media container visibility, then iterates through Excel rows (*Linkdin*, *Twitter*, *Facebook*, *Instagram*) validating icon visibility, clickability, new tab popup handling, and external URL match (with `x.com`/`twitter.com` resolution). |
| **TC09** | App Store Buttons (Data-Driven) | Excel (`App Stores`) | Validates App Store container, then iterates through Excel rows (*App Store*, *Playstore*) validating visibility, clickability, same-tab/popup navigation, and storefront redirect URL verification. |
| **TC10** | License & Copyright Section | DOM | Validates License and Copyright section container visibility, verifies license field text display, and verifies copyright field text display. |

---

## 📊 Data-Driven Testing (Excel Structure)

Test data is stored centrally in [`TestData/AlAin_Footer.xlsx`](TestData/AlAin_Footer.xlsx) and accessed via [`Utils/dataProvider.js`](Utils/dataProvider.js):

| Sheet Name | Column 1 (`Links`) | Column 2 (`Expected URL`) |
| :--- | :--- | :--- |
| **Quick Links** | About Us, Health Guide, Store Locator, Blogs | Corresponding page URLs on `alainpharmacy.ae` |
| **Help & Support** | Contact Us, FAQs, Terms and Conditions, Privacy Policy | Support, returns, terms, and privacy URLs |
| **My Accounts** | Login / Register, View Cart, My Wishlist, Order History | Account, cart, wishlist, and order URLs |
| **Social Media** | Linkdin, Twitter, Facebook, Instagram | Official LinkedIn, X (Twitter), Facebook, and Instagram URLs |
| **App Stores** | App Store, Playstore | Official Apple App Store and Google Play Store URLs |

---

## 💻 Test Execution Commands

### 1. Run all tests
```powershell
npm test
```

### 2. Run on Chrome in Headed Mode
```powershell
npm run test:chrome
```

### 3. Run specific test suites
- **Header suite only:**
  ```powershell
  npx playwright test tests/Header.spec.js --headed
  ```
- **Footer suite only:**
  ```powershell
  npx playwright test tests/Footer.spec.js --headed
  ```

### 4. Run an individual test case
```powershell
# Run TC04 in Footer
npx playwright test tests/Footer.spec.js -g "TC04" --headed

# Run TC08 in Footer (Social Media)
npx playwright test tests/Footer.spec.js -g "TC08" --headed

# Run TC09 in Footer (App Stores)
npx playwright test tests/Footer.spec.js -g "TC09" --headed

# Run TC10 in Footer (License & Copyright)
npx playwright test tests/Footer.spec.js -g "TC10" --headed
```

### 5. Run in Debug / UI Mode
```powershell
# Interactive Playwright Inspector
npx playwright test --debug

# Playwright UI Mode
npx playwright test --ui
```

---

## 📈 Allure Reporting Commands

The framework integrates `allure-playwright`. Test executions automatically save raw result artifacts into `allure-results/`.

### 1. Generate and view Allure Report in browser (Recommended)
```powershell
npm run allure:serve
```

### 2. Generate a static Allure HTML report
```powershell
npm run allure:generate
```

### 3. Open previously generated static report
```powershell
npm run allure:open
```

---

## 🧹 Cleaning Up Old Reports & Artifacts

Clean previous run artifacts before executing a clean test run:
```powershell
npm run clean
```

Or manually via PowerShell:
```powershell
Remove-Item -Recurse -Force test-results, playwright-report, allure-results, allure-report -ErrorAction SilentlyContinue
```

---

## 🏗️ Key Architecture & Design Highlights

1. **Page Object Model (POM)**:
   - UI elements and interactions are encapsulated within [`Pages/Header.js`](Pages/Header.js) and [`Pages/Footer.js`](Pages/Footer.js), inheriting common browser actions from [`Pages/Basepage.js`](Pages/Basepage.js).

2. **Worker-Scoped Shared Session (`sharedPage`)**:
   - Configured in [`playwright.config.js`](playwright.config.js) with `workers: 1` and `fullyParallel: false`.
   - The worker fixture in [`Fixtures/testFixture.js`](Fixtures/testFixture.js) launches the browser and completes the initial navigation once, executing all tests sequentially in the **same browser session** to avoid repeated captcha challenges.

3. **Data-Driven Architecture**:
   - Reusable validation methods (`validateFooterLink`, `validateSocialMedia`, `validateAppStore`) in `Footer.js` consume Excel data dynamically, replacing hundreds of lines of repetitive test steps with clean, maintainable loops.

4. **Allure Step Logger & Visual Element Highlighter**:
   - Custom `logger.verify()` logs timestamped messages to the console and attaches verification notes to Allure test steps.
   - On assertion failures, [`Utils/highlighter.js`](Utils/highlighter.js) dynamically injects a red outline, glowing shadow, and a visual `❌ FAILED HERE` badge into the DOM before capturing and attaching failure screenshots.

5. **Flexible Navigation & Popup Handlers**:
   - Reusable methods automatically detect whether links open in a new tab (`target="_blank"`) or navigate in the same window (`_self`), handling popup promises, back navigation, and localized storefront URL redirects seamlessly.

6. **Continuous Integration (CI)**:
   - Automated via [`.github/workflows/playwright.yml`](.github/workflows/playwright.yml) on push and pull requests, installing dependencies and uploading Playwright reports as workflow artifacts.
