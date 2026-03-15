import { Link } from "react-router-dom";

export default function Sidebar() {

  return (
    <div className="w-64 bg-blue-900 text-white min-h-screen p-5">

      <h1 className="text-2xl font-bold mb-10">
        LeaseMate
      </h1>

      <nav className="space-y-4">

        <Link to="/" className="block hover:text-gray-300">
          Dashboard
        </Link>

        <Link to="/properties" className="block hover:text-gray-300">
          Properties
        </Link>

        <Link to="/rooms" className="block hover:text-gray-300">
          Rooms
        </Link>

        <Link to="/tenants" className="block hover:text-gray-300">
          Tenants
        </Link>

        <Link to="/ledger" className="block hover:text-gray-300">
          Ledger
        </Link>

      </nav>

    </div>
  );
}