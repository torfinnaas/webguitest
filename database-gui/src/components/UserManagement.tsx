import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../lib/api';
import { User } from '../lib/api';
import UserForm from './UserForm';
import UserTable from './UserTable';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Toaster } from './ui/toaster';
import { useToast } from './ui/use-toast';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch users from the database.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      setLoading(true);
      const newUser = await createUser(userData);
      setUsers([...users, newUser]);
      toast({
        title: "Success",
        description: "User created successfully!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      setLoading(true);
      const updatedUser = await updateUser(id, userData);
      setUsers(users.map(user => user.id === id ? updatedUser : user));
      setEditingUser(null);
      toast({
        title: "Success",
        description: "User updated successfully!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setLoading(true);
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete user.",
      });
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user: User) => {
    setEditingUser(user);
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  return (
    <div className="container mx-auto p-4">
      <Toaster />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm 
              onSubmit={editingUser 
                ? (data) => handleUpdateUser(editingUser.id, data) 
                : handleCreateUser
              }
              initialValues={editingUser || undefined}
              onCancel={editingUser ? cancelEditing : undefined}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Database</CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !users.length ? (
              <p className="text-center py-4">Loading users...</p>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={fetchUsers} className="mt-2">Retry</Button>
              </div>
            ) : (
              <UserTable 
                users={users} 
                onEdit={startEditing} 
                onDelete={handleDeleteUser}
                loading={loading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
