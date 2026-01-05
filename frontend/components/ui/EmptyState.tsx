interface EmptyStateProps {
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ message, action }: Readonly<EmptyStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full p-6 mb-6">
        <svg
          className="w-20 h-20 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
      <p className="text-xl font-semibold text-gray-700 mb-2">{message}</p>
      <p className="text-sm text-gray-500 mb-6">
        Get started by creating a new entry
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105 font-semibold"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
