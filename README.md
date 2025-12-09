# SnapBill - Smart Mobile Billing Application

SnapBill is a modern, mobile-first billing and invoicing software designed for small businesses and freelancers. It leverages **Google Gemini AI** to simplify invoice creation and includes comprehensive inventory management, user authentication, and financial reporting.

## 🚀 Key Features

### 🤖 AI & Smart Automation
- **Magic Input**: Type natural language (e.g., "Bill John $50 for consulting") and let Gemini AI generate the invoice structure automatically.
- **Smart Currency Detection**: Auto-detects currency based on the user's location.

### 📦 Inventory Management
- **Product Tracking**: Manage products, services, and stock levels.
- **Visual Inventory**: Support for product images.
- **Stock Control**: Automatic stock deduction when invoices are created.

### 💰 Invoicing & Financials
- **Detailed Breakdowns**: Handle Discounts, Tax, Shipping, Handling, and Packaging fees.
- **Sharing**: Share invoices directly via WhatsApp.
- **Statements**: Filter history by date/status and export Statements to **Excel/CSV**.

### 🔐 User Management & Security
- **Role-Based Access**: Super Admin vs. Standard Users.
- **Approval Workflow**: New registrations require Admin approval before accessing the dashboard.
- **Social Login**: Integrated social login options (Mock implementation).

### ⚙️ Customization
- **Business Profile**: Configure Tax IDs, Contact info, and default fee structures.
- **Legal Pages**: Built-in Privacy Policy and Terms & Conditions templates.

---

## 🛠️ Installation & Setup

1. **Clone the repository** (or download source files):
   ```bash
   git clone <repository-url>
   cd snapbill
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file in the root directory and add your Google Gemini API Key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the Application**:
   ```bash
   npm start
   ```

---

## 🔑 Default Credentials

To manage users and access the **Admin Panel**, login with the pre-configured Super Admin account:

- **Email**: `rahu431@gmail.com`
- **Password**: `admin`

*Note: This user bypasses approval checks and has exclusive access to the Admin tab to approve/reject other registered users.*

---

## 📱 Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google GenAI SDK (Gemini 2.5 Flash)
- **State Management**: React Hooks + LocalStorage Persistence
- **Routing**: React Router DOM

---

## © Copyright

Created by **rahu431@gmail.com**. All rights reserved.
