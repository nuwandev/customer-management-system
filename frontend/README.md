# Customer Management System - Frontend

A modern, responsive customer management dashboard built with Next.js 16, React 19, and TypeScript. Features server-side rendering, real-time data fetching with React Query, and a polished UI with Tailwind CSS.

## 🚀 Tech Stack

- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **TanStack React Query 5** - Server state management & caching
- **Axios 1.13.2** - HTTP client
- **React Hook Form 7.71.1** - Form management
- **Lucide React** - Modern icon library

## 📋 Features

### Customer Management

-- **List View** - Paginated customer table with sorting, search, and dynamic page size selection

- **Create** - Add new customers with form validation
- **Edit** - Update customer information
- **Delete** - Remove customers with confirmation dialog
- **Search** - Real-time search across name and email fields
- **Status Management** - Toggle between ACTIVE/INACTIVE states

### UI/UX Features

- **Responsive Design** - Mobile-first, works on all screen sizes
- **Server-Side Rendering** - Fast initial page loads
- **Optimistic Updates** - Instant UI feedback
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Success/error feedback
- **Confirmation Dialogs** - Prevent accidental deletions

### Performance

- **Data Caching** - React Query automatic cache management
  -- **Pagination** - Efficient data loading with user-selectable page size (10, 25, 50, 100 records per page)
- **Stale-While-Revalidate** - Background data refresh
- **Query Invalidation** - Smart cache updates on mutations

## 🏗️ Project Structure

```
app/
├── globals.css                  # Global styles
├── layout.tsx                   # Root layout with providers
├── page.tsx                     # Homepage (redirects to customers)
├── providers.tsx                # React Query provider
└── customers/
    ├── page.tsx                 # Customer list page
    ├── new/
    │   └── page.tsx            # Create customer page
    └── [id]/
        └── edit/
            └── page.tsx        # Edit customer page

components/
├── customers/
│   ├── customer-form.tsx        # Reusable form component
│   ├── customer-table.tsx       # Table with sorting/search
│   ├── delete-dialog.tsx        # Confirmation dialog
│   └── pagination.tsx           # Pagination controls
└── ui/                          # Reusable UI components
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── select.tsx
    └── toast.tsx

lib/
├── utils.ts                     # Utility functions
├── api/
│   ├── client.ts               # Axios instance & interceptors
│   └── customers.ts            # Customer API functions
└── types/
    └── customer.ts             # TypeScript interfaces
```

## 🔌 API Integration

### Customer API Functions

```typescript
// Fetch paginated customers
getCustomers(page, size, sort, order, search);

// Get single customer by ID
getCustomerById(id);

// Create new customer
createCustomer(data);

// Update existing customer
updateCustomer(id, data);

// Delete customer
deleteCustomer(id);
```

### React Query Hooks

```typescript
// List customers with caching
useQuery({ queryKey: ["customers", page, sort, order, search] });

// Create customer mutation
useMutation({ mutationFn: createCustomer });

// Update customer mutation
useMutation({ mutationFn: updateCustomer });

// Delete customer mutation
useMutation({ mutationFn: deleteCustomer });
```

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 20+
- npm or yarn
- Backend API running on `http://localhost:8081`

### Installation

1. **Clone and navigate to frontend**

```bash
cd frontend
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Configure API endpoint** (optional)

Update [lib/api/client.ts](lib/api/client.ts) if your backend runs on a different port:

```typescript
const apiClient = axios.create({
  baseURL: "http://localhost:8081/api/v1",
});
```

4. **Run development server**

```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

```
http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📱 Pages & Routes

| Route                  | Component                                    | Description                            |
| ---------------------- | -------------------------------------------- | -------------------------------------- |
| `/`                    | [page.tsx](app/page.tsx)                     | Homepage (redirects to /customers)     |
| `/customers`           | [page.tsx](app/customers/page.tsx)           | Customer list with search & pagination |
| `/customers/new`       | [page.tsx](app/customers/new/page.tsx)       | Create new customer form               |
| `/customers/[id]/edit` | [page.tsx](app/customers/[id]/edit/page.tsx) | Edit existing customer form            |

## 🎨 Component Documentation

### CustomerTable

- Displays paginated customer data in a responsive table
- Sorting by firstName, lastName, email, status, createdAt
- Real-time search functionality
- Status badges (ACTIVE/INACTIVE)
- Action buttons (Edit, Delete)

### CustomerForm

- Reusable form for Create/Edit operations
- Form validation with React Hook Form
- Input fields: firstName, lastName, email, phone, status
- Error display for validation failures
- Submission handling with loading states

### DeleteDialog

- Confirmation modal for delete operations
- Prevents accidental deletions
- Shows customer details in confirmation message

### Pagination

- First, Previous, Next, Last navigation
- Page number display
- Total pages and records count
- Page size dropdown (10, 25, 50, 100) next to page indicator
- Disabled states for boundary pages
- User's page size choice is remembered and persists between visits

## 🎨 UI Components

All UI components are built with Tailwind CSS and follow a consistent design system:

- **Button** - Primary, secondary, and destructive variants
- **Input** - Form inputs with validation states
- **Select** - Dropdown selections
- **Card** - Container components
- **Badge** - Status indicators
- **Dialog** - Modal windows
- **Toast** - Notification system

## 🔄 Data Flow

```
User Action → Component → React Query Hook → API Client → Backend API
                ↓                                              ↓
            UI Update ← Cache Update ← Response ← Response
```

### Query Keys Strategy

```typescript
["customers"][("customers", page, sort, order)][ // All customers list // Paginated list
  ("customers", page, sort, order, term)
][("customer", id)]; // Filtered list // Single customer
```

## 🎯 Key Features Explained

### Optimistic Updates

When deleting or updating customers, the UI updates immediately while the API request is in progress, providing instant feedback.

### Cache Invalidation

After mutations (create, update, delete), React Query automatically refetches the customer list to ensure data consistency.

### Error Boundaries

Errors are caught and displayed with user-friendly messages, preventing app crashes.

### Form Validation

- Required fields: firstName, lastName, email
- Email format validation
- Phone number optional
- Status selection required

## 📦 Build & Deploy

### Environment Variables

Create `.env.local` for environment-specific config:

```env
NEXT_PUBLIC_API_URL=http://localhost:8081/api/v1
```

### Docker Deployment (Future)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration Files

- [next.config.ts](next.config.ts) - Next.js configuration
- [tailwind.config.ts](tailwind.config.ts) - Tailwind CSS setup (v4)
- [tsconfig.json](tsconfig.json) - TypeScript compiler options
- [eslint.config.mjs](eslint.config.mjs) - ESLint rules
- [postcss.config.mjs](postcss.config.mjs) - PostCSS configuration

## 🚀 Performance Optimizations

1. **React Query Caching** - Reduces unnecessary API calls
2. **Server Components** - Faster initial page loads
3. **Code Splitting** - Automatic route-based splitting
4. **Image Optimization** - Next.js Image component
5. **Pagination** - Limited data per page, with user-selectable page size (10, 25, 50, 100 records)

## 🐛 Common Issues

### API Connection Failed

- Ensure backend is running on `http://localhost:8081`
- Check CORS configuration in backend
- Verify API endpoints are accessible

### Hydration Errors

- Ensure consistent server/client rendering
- Check for browser-specific code in server components

## 🔐 Security Considerations

### Current Implementation

- Input sanitization through React Hook Form
- Email validation
- XSS protection via React's built-in escaping

### To Implement

- Authentication/Authorization
- CSRF tokens
- Rate limiting
- Input sanitization on backend

## 📚 Learning Resources

This project demonstrates:

- Modern React patterns (hooks, custom hooks)
- Next.js App Router best practices
- TypeScript strict mode usage
- Server-side rendering techniques
- State management with React Query
- Form handling with React Hook Form
- Responsive design with Tailwind CSS

## 🤝 Contributing

This is a portfolio project showcasing full-stack development skills.

## 📄 License

This project is part of a learning portfolio.

## 👤 Author

Built as part of a full-stack customer management system with a focus on modern React development practices.
