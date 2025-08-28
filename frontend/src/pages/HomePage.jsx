import { Link } from "react-router-dom";
import React from "react";

function HomePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sistem Antrian</h1>
      <nav className="mb-6">
        <ul className="flex gap-4">
          <li><Link to="/loronganak">Lorong Anak</Link></li>
          <li><Link to="/loronganak/view">Lorong Anak View</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default HomePage;