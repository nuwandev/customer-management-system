# Customer Management System - Frontend

A modern, professional customer management system built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ✅ **Customer List**: View all customers with pagination, sorting, and search
- ✅ **Create Customer**: Add new customers with validation
- ✅ **Edit Customer**: Update existing customer information
- ✅ **Delete Customer**: Remove customers with confirmation dialog
- ✅ **Responsive Design**: Mobile-friendly interface
- ✅ **Real-time Updates**: Optimistic UI updates with React Query
- ✅ **Form Validation**: Client-side validation with react-hook-form
- ✅ **Loading States**: Smooth loading indicators
- ✅ **Error Handling**: Comprehensive error messages

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form
- **HTTP Client**: Axios
- **UI Components**: Custom components with Tailwind

## Prerequisites

- Node.js 18+
- npm or yarn
- Spring Boot API running on `http://localhost:8081`

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8081
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Project Structure

\`\`\`
customer-management-ui/
├── app/ # Next.js app directory
│ ├── customers/ # Customer pages
│ │ ├── page.tsx # List page
│ │ ├── new/ # Create page
│ │ └── [id]/edit/ # Edit page
│ ├── layout.tsx # Root layout
│ └── providers.tsx # React Query provider
├── components/ # React components
│ ├── ui/ # Reusable UI components
│ └── customers/ # Customer-specific components
├── lib/ # Utilities and configs
│ ├── api/ # API client and endpoints
│ ├── types/ # TypeScript types
│ └── utils.ts # Helper functions
└── public/ # Static assets
\`\`\`

## API Integration

All API endpoints from your Spring Boot backend are integrated:

- `GET /api/v1/customers` - List with pagination, sorting, search
- `GET /api/v1/customers/{id}` - Get single customer
- `POST /api/v1/customers` - Create customer
- `PUT /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Delete customer

## Features in Detail

### Pagination

- Configurable page size (10, 25, 50, 100)
- Previous/Next navigation
- Page indicator

### Sorting

- Sort by: First Name, Last Name, Email, Created At
- Order: Ascending or Descending

### Search

- Real-time search across name and email
- Debounced for performance

### Form Validation

- Required fields validation
- Email format validation
- Minimum length validation
- Real-time error messages

## Best Practices Used

- ✅ TypeScript for type safety
- ✅ React Query for server state management
- ✅ Component composition and reusability
- ✅ Separation of concerns (API, types, components)
- ✅ Error boundaries and error handling
- ✅ Loading and empty states
- ✅ Responsive design
- ✅ Accessibility considerations
- ✅ Clean code and consistent formatting

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
