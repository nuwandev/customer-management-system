import { Card, CardContent } from "./card";

const BackendOfflineCard = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-lg font-semibold text-gray-800">
            Backend currently offline
          </p>

          <p className="text-sm text-gray-500 max-w-md">
            This Customer Management System uses a locally hosted backend. The
            frontend is fully functional, but live data is unavailable at the
            moment.
          </p>

          <p className="text-sm text-gray-500">
            For testing or a live demo, I can temporarily run the backend via a
            secure tunnel.
          </p>

          <p className="text-sm font-medium text-gray-700">
            Contact: <span className="text-blue-600">@nuwandev</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendOfflineCard;
