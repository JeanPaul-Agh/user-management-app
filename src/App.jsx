import darkModeIcon from './assets/icons8-moon-symbol-50.png';

function App() {

  const users = [
    { id: '1', firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', status: 'active', dob: '1990-05-15' },
    { id: '2', firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', status: 'locked', dob: '1998-10-22' },
    { id: '3', firstName: 'Alice', lastName: 'Johnson', email: 'ama.johnson@example.com', status: 'active', dob: '1995-02-30' },
    { id: '4', firstName: 'Bob', lastName: 'Williams', email: 'bob.williams@example.com', status: 'locked', dob: '1980-04-26' },
    { id: '5', firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@example.com', status: 'locked', dob: '1982-10-30' },
    { id: '6', firstName: 'David', lastName: 'Lee', email: 'david.lee@example.com', status: 'locked', dob: '1980-03-14' },
    { id: '7', firstName: 'Eve', lastName: 'Green', email: 'eve.green@example.com', status: 'active', dob: '1983-05-21' },
    { id: '8', firstName: 'Frank', lastName: 'White', email: 'frank.white@example.com', status: 'active', dob: '1984-01-25' },
    { id: '9', firstName: 'Grace', lastName: 'Black', email: 'grace.black@example.com', status: 'locked', dob: '1986-03-17' },
    { id: '10', firstName: 'Hannah', lastName: 'Pearl', email: 'hannah.pearl@example.com', status: 'active', dob: '1986-12-02' },
    { id: '11', firstName: 'Ed', lastName: 'Calece', email: 'ed.calece@example.com', status: 'locked', dob: '1985-07-19' },
    { id: '12', firstName: 'Eddie', lastName: 'Morgan', email: 'eddie.calece@example.com', status: 'locked', dob: '1999-09-21' },
  ];


  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation Bar */}
      <nav className="p-4 shadow-md bg-primary">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-md bg-white text-primary font-medium hover:bg-gray-100 transition">
              Create User
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
              Logout
            </button>
            <button>
              <img src={darkModeIcon} alt="Dark Mode Toggle" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="container mx-auto p-4 bg-gray-50">
        <input
          type="text"
          placeholder="Search users..."
          className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-900 w-[250px]"
        />  
      </div>

      <main className="container mx-auto p-4">
        {/* User Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg bg-white"
            >
              <div className="p-6">
                {/* User Avatar */}
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                
                {/* User Info */}
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Email:</span> {user.email}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <span className="font-medium">Status:</span> {user.status}
                  </p>
                  <p className="text-gray-600 mb-4">
                    <span className="font-medium">DOB:</span> {user.dob}
                  </p>
                
                  {/* Edit & Delete Buttons */}
                  <div className="flex justify-end gap-3">
                    <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
