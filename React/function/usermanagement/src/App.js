import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import AddUserForm from './components/AddUserForm';

function App() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    axios
      .get('https://jsonplaceholder.typicode.com/users')
      .then((response) => setUsers(response.data))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [users, searchTerm]);

  const handleDeleteUser = (userId) => {
    axios
      .delete(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(() => {
        // Remove the deleted user from the state
        setUsers(users.filter((user) => user.id !== userId));
      })
      .catch((error) => console.error('Error deleting user:', error));
  };
  const handleEditUser = (userId) => {
    // Implement edit user functionality
  };
  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredUsers.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleAddUser = (user) => {
    // Implement add user functionality
    axios
      .post('https://jsonplaceholder.typicode.com/users', user)
      .then((response) => {
        // Assuming the response data contains the newly created user object
        const newUser = response.data;
        setUsers([...users, newUser]);
      })
      .catch((error) => console.error('Error adding user:', error));
  };

  return (
    <div>
      <input
        type='text'
        placeholder='Search by username'
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <AddUserForm addUser={handleAddUser} />
      <table>
        {/* Table header */}
        <thead>
          <tr>
            <th>Username</th>
            <th>User ID</th>
            <th>Created Date</th>
            <th>Email ID</th>
            <th>Edit User</th>
            <th>Delete User</th>
          </tr>
        </thead>
        {/* Table body */}
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.id}</td>
              <td>{user.created_at}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => handleEditUser(user.id)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination */}
      <div>
        {currentPage > 1 && <button onClick={handlePrevPage}>Previous</button>}
        {Array.from({
          length: Math.ceil(filteredUsers.length / usersPerPage),
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        {currentPage < Math.ceil(filteredUsers.length / usersPerPage) && (
          <button onClick={handleNextPage}>Next</button>
        )}
      </div>
    </div>
  );
}

export default App;
