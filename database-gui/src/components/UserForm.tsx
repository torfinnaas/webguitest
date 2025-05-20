import React, { useState } from 'react';
import { User } from '../lib/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface UserFormProps {
  onSubmit: (data: Omit<User, 'id'>) => void;
  initialValues?: User;
  onCancel?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialValues, onCancel }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [age, setAge] = useState(initialValues?.age?.toString() || '');
  const [errors, setErrors] = useState<{ name?: string; age?: string }>({});

  const validate = (): boolean => {
    const newErrors: { name?: string; age?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!age.trim()) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(age)) || Number(age) <= 0) {
      newErrors.age = 'Age must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        name,
        age: Number(age)
      });
      
      // Reset form if not editing
      if (!initialValues) {
        setName('');
        setAge('');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
          className={errors.age ? "border-red-500" : ""}
        />
        {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
      </div>
      
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {initialValues ? 'Update User' : 'Add User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
