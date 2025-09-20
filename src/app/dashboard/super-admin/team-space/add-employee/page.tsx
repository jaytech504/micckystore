'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronDown, 
  Calendar, 
  User, 
  Briefcase, 
  Key,
  Loader2
} from 'lucide-react';
import { useEmployeeOperations, useEmployee } from '../../hooks/useEmployees';
import { useAuth } from '../../../../../hooks/useAuth';
import ProtectedRoute from '../../../../../components/ProtectedRoute';
import { useRouter, useSearchParams } from 'next/navigation';
import { branchesApi, Branch } from '../../../../../api/branchesApi';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  maritalStatus: string;
  gender: string;
  nationality: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface JobInfo {
  staffId: string;
  username: string;
  workType: string;
  emailAddress: string;
  department: string;
  jobTitle: string;
  expectedWorkingDays: string[];
  resumptionDate: string;
  branchLocation: string;
  salary: string;
}

interface AccountAccess {
  emailAddress: string;
  staffId: string;
  systemRole: string;
}

interface EmployeeFormData {
  personalInfo: PersonalInfo;
  jobInfo: JobInfo;
  accountAccess: AccountAccess;
}

type TabType = 'personal' | 'job' | 'account';

// Reusable Input Component - Defined outside to prevent re-creation with forced focus
const InputField = React.memo(({ 
  label, 
  value, 
  onChange, 
  type = 'text', 
  placeholder = '' 
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Force focus to stay on the input
  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Prevent blur if we're still typing
    setTimeout(() => {
      if (inputRef.current && isFocused) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    // Ensure focus stays after change
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="flex flex-col space-y-2">
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent text-sm"
        autoComplete="off"
      />
    </div>
  );
});

// Reusable Select Component - Defined outside to prevent re-creation with forced focus
const SelectField = React.memo(({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = '' 
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  placeholder?: string;
}) => {
  const selectRef = React.useRef<HTMLSelectElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Force focus to stay on the select
  React.useEffect(() => {
    if (isFocused && selectRef.current) {
      selectRef.current.focus();
    }
  }, [isFocused, value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Prevent blur if we're still interacting
    setTimeout(() => {
      if (selectRef.current && isFocused) {
        selectRef.current.focus();
      }
    }, 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
    // Ensure focus stays after change
    setTimeout(() => {
      if (selectRef.current) {
        selectRef.current.focus();
      }
    }, 0);
  };

  return (
    <div className="relative">
      <select
        ref={selectRef}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm appearance-none bg-white"
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
    </div>
  );
});

const AddNewEmployee = () => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [isEditMode, setIsEditMode] = useState(false);
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Branch state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [branchesError, setBranchesError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createEmployee, updateEmployee, loading: operationLoading } = useEmployeeOperations();
  
  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setBranchesLoading(true);
        setBranchesError(null);
        const response = await branchesApi.getBranches();
        if (response.data && response.data.branches) {
          setBranches(response.data.branches);
        } else {
          setBranchesError('Failed to load branches');
        }
      } catch (error) {
        setBranchesError('Error loading branches');
        console.error('Error fetching branches:', error);
      } finally {
        setBranchesLoading(false);
      }
    };

    fetchBranches();
  }, []);
  
  // Check if we're in edit mode
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      setIsEditMode(true);
      setEmployeeId(editId);
    }
  }, [searchParams]);

  // Fetch employee data if in edit mode
  const { employee, loading: employeeLoading, error: employeeError } = useEmployee(employeeId || '');

  const [formData, setFormData] = useState<EmployeeFormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      emailAddress: '',
      dateOfBirth: '',
      maritalStatus: '',
      gender: '',
      nationality: '',
      address: '',
      city: '',
      state: '',
      zipCode: ''
    },
    jobInfo: {
      staffId: '',
      username: '',
      workType: '',
      emailAddress: '',
      department: '',
      jobTitle: '',
      expectedWorkingDays: [],
      resumptionDate: '',
      branchLocation: '',
      salary: ''
    },
    accountAccess: {
      emailAddress: '',
      staffId: '',
      systemRole: ''
    }
  });

  // Populate form data when employee is loaded (edit mode)
  useEffect(() => {
    if (employee && isEditMode) {
      setFormData({
        personalInfo: {
          firstName: employee.firstName || '',
          lastName: employee.lastName || '',
          phoneNumber: employee.phoneNumber || '',
          emailAddress: employee.email || '',
          dateOfBirth: employee.dateOfBirth || '',
          maritalStatus: employee.maritalStatus || '',
          gender: employee.gender || '',
          nationality: employee.nationality || '',
          address: employee.address || '',
          city: employee.city || '',
          state: employee.state || '',
          zipCode: employee.zipCode || ''
        },
        jobInfo: {
          staffId: employee.staffId || '',
          username: employee.name || '',
          workType: employee.workMode || '',
          emailAddress: employee.email || '',
          department: employee.department || '',
          jobTitle: employee.jobTitle || '',
          expectedWorkingDays: employee.expectedWorkingDays || [],
          resumptionDate: employee.resumptionDate || '',
          branchLocation: employee.branchId || ''
        },
        accountAccess: {
          emailAddress: employee.email || '',
          staffId: employee.staffId || '',
          systemRole: employee.role || ''
        }
      });
    }
  }, [employee, isEditMode]);

  // Handler for form data updates - ready for API integration
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateJobInfo = (field: keyof JobInfo, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        [field]: value
      }
    }));
  };

  const updateWorkingDays = (day: string, checked: boolean) => {
    const currentDays = formData.jobInfo.expectedWorkingDays;
    if (checked) {
      updateJobInfo('expectedWorkingDays', [...currentDays, day]);
    } else {
      updateJobInfo('expectedWorkingDays', currentDays.filter(d => d !== day));
    }
  };

  const updateAccountAccess = (field: keyof AccountAccess, value: string) => {
    setFormData(prev => ({
      ...prev,
      accountAccess: {
        ...prev.accountAccess,
        [field]: value
      }
    }));
  };

  // API integration functions
  const handleNext = async () => {
    if (activeTab === 'personal') {
      setActiveTab('job');
    } else if (activeTab === 'job') {
      setActiveTab('account');
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare data for API
      const employeeData = {
        firstName: formData.personalInfo.firstName,
        lastName: formData.personalInfo.lastName,
        name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
        staffId: formData.jobInfo.staffId,
        email: formData.personalInfo.emailAddress,
        phoneNumber: formData.personalInfo.phoneNumber,
        dateOfBirth: formData.personalInfo.dateOfBirth,
        maritalStatus: formData.personalInfo.maritalStatus as 'single' | 'married',
        gender: formData.personalInfo.gender as 'Male' | 'Female' | 'Other',
        nationality: formData.personalInfo.nationality,
        address: formData.personalInfo.address,
        city: formData.personalInfo.city,
        state: formData.personalInfo.state,
        zipCode: formData.personalInfo.zipCode,
        department: formData.jobInfo.department,
        role: formData.accountAccess.systemRole as 'Super Admin' | 'Admin' | 'Staff' | 'Manager' | 'HR' | 'Finance',
        jobTitle: formData.jobInfo.jobTitle,
        status: 'Active' as 'Active' | 'Inactive' | 'Suspended',
        workMode: formData.jobInfo.workType as 'Office' | 'Remote' | 'Hybrid',
        resumptionDate: formData.jobInfo.resumptionDate,
        expectedWorkingDays: formData.jobInfo.expectedWorkingDays,
        branchId: formData.jobInfo.branchLocation
      };

      if (isEditMode && employeeId) {
        await updateEmployee(employeeId, employeeData);
        alert('Employee updated successfully!');
      } else {
        await createEmployee(employeeData);
        alert('Employee created successfully!');
      }
      
      // Redirect back to employee list
      router.push('/dashboard/super-admin/team-space');
    } catch (error: any) {
      setSubmitError(error.message || 'An error occurred while saving employee');
      console.error('Error saving employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/super-admin/team-space');
  };


  // Personal Information Tab
  const PersonalInfoTab = () => (
    <div className="space-y-6 text-black">
      {/* Profile Picture Upload */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center bg-gray-50">
          <User className="w-8 h-8 text-gray-400" />
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="First Name"
          value={formData.personalInfo.firstName}
          onChange={(value) => updatePersonalInfo('firstName', value)}
        />
        <InputField
          label="Last Name"
          value={formData.personalInfo.lastName}
          onChange={(value) => updatePersonalInfo('lastName', value)}
        />
      </div>

      {/* Contact Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Phone Number"
          value={formData.personalInfo.phoneNumber}
          onChange={(value) => updatePersonalInfo('phoneNumber', value)}
          type="tel"
        />
        <InputField
          label="Email Address"
          value={formData.personalInfo.emailAddress}
          onChange={(value) => updatePersonalInfo('emailAddress', value)}
          type="email"
        />
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <InputField
            label="Date of Birth"
            value={formData.personalInfo.dateOfBirth}
            onChange={(value) => updatePersonalInfo('dateOfBirth', value)}
            type="date"
          />
          <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-[#FBB906] pointer-events-none" />
        </div>
        <SelectField
          label="Marital Status"
          value={formData.personalInfo.maritalStatus}
          onChange={(value) => updatePersonalInfo('maritalStatus', value)}
          options={['single', 'married']}
          placeholder="Marital Status"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Gender"
          value={formData.personalInfo.gender}
          onChange={(value) => updatePersonalInfo('gender', value)}
          options={['Male', 'Female', 'Other']}
        />
        <SelectField
          label="Nationality"
          value={formData.personalInfo.nationality}
          onChange={(value) => updatePersonalInfo('nationality', value)}
          options={['Nigeria']}
        />
      </div>

      {/* Address */}
      <InputField
        label="Address"
        value={formData.personalInfo.address}
        onChange={(value) => updatePersonalInfo('address', value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SelectField
          label="City"
          value={formData.personalInfo.city}
          onChange={(value) => updatePersonalInfo('city', value)}
          options={['Lagos', 'Abuja', 'Port Harcourt', 'Kano']}
        />
        <SelectField
          label="State"
          value={formData.personalInfo.state}
          onChange={(value) => updatePersonalInfo('state', value)}
          options={['Lagos', 'FCT', 'Rivers', 'Kano']}
        />
        <InputField
          label="ZIP Code"
          value={formData.personalInfo.zipCode}
          onChange={(value) => updatePersonalInfo('zipCode', value)}
        />
      </div>
    </div>
  );

  // Job Information Tab
  const JobInfoTab = () => (
    <div className="space-y-6 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Staff ID"
          value={formData.jobInfo.staffId}
          onChange={(value) => updateJobInfo('staffId', value)}
        />
        <InputField
          label="Username (First name of staff)"
          value={formData.jobInfo.username}
          onChange={(value) => updateJobInfo('username', value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Work Mode"
          value={formData.jobInfo.workType}
          onChange={(value) => updateJobInfo('workType', value)}
          options={['Office', 'Remote', 'Hybrid']}
          placeholder="Select work mode"
        />
        <InputField
          label="Email Address"
          value={formData.jobInfo.emailAddress}
          onChange={(value) => updateJobInfo('emailAddress', value)}
          type="email"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField
          label="Department"
          value={formData.jobInfo.department}
          onChange={(value) => updateJobInfo('department', value)}
          options={['IT', 'Accountant', 'Front desk officer', 'Online sales', 'Engineer', 'Office assistant', 'Sales']}
          placeholder="Select Department"
        />
        <InputField
          label="Job Title"
          value={formData.jobInfo.jobTitle}
          onChange={(value) => updateJobInfo('jobTitle', value)}
          placeholder="Type Job Title"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Expected Working Days</label>
          <div className="grid grid-cols-2 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
              <label key={day} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.jobInfo.expectedWorkingDays.includes(day)}
                  onChange={(e) => updateWorkingDays(day, e.target.checked)}
                  className="w-4 h-4 text-[#E866B7] border-gray-300 rounded focus:ring-[#E866B7] focus:ring-2"
                />
                <span className="text-sm text-gray-700">{day}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="relative">
          <InputField
            label="Resumption Date"
            value={formData.jobInfo.resumptionDate}
            onChange={(value) => updateJobInfo('resumptionDate', value)}
            type="date"
          />
          <Calendar className="absolute right-3 top-3.5 h-5 w-5 text-[#FBB906] pointer-events-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="relative">
          <InputField
            label="Salary"
            value={formData.jobInfo.salary}
            onChange={(value) => updateJobInfo('salary', value)}
            type="text"
          />

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">Branch Location</label>
        <select
        value={formData.jobInfo.branchLocation}
          onChange={(e) => updateJobInfo('branchLocation', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm appearance-none bg-white"
          disabled={branchesLoading}
        >
          <option value="">{branchesLoading ? 'Loading branches...' : 'Select Branch Location'}</option>
          {branches.map((branch) => (
            <option key={branch._id} value={branch._id}>
              {branch.name} - {branch.city}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 pointer-events-none" />
        {branchesError && (
          <p className="text-red-500 text-xs mt-1">{branchesError}</p>
        )}
      </div>
    </div>
  );

  // Account Access Tab
  const AccountAccessTab = () => (
    <div className="space-y-6 text-black">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          label="Enter Email Address"
          value={formData.accountAccess.emailAddress}
          onChange={(value) => updateAccountAccess('emailAddress', value)}
          type="email"
        />
        <InputField
          label="Staff ID"
          value={formData.accountAccess.staffId}
          onChange={(value) => updateAccountAccess('staffId', value)}
        />
      </div>

      <SelectField
        label="System Role"
        value={formData.accountAccess.systemRole}
        onChange={(value) => updateAccountAccess('systemRole', value)}
        options={['Super Admin', 'Admin', 'Staff', 'Manager', 'HR', 'Finance']}
        placeholder="Select system role"
      />
    </div>
  );

  // Show loading state when fetching employee data in edit mode
  if (isEditMode && employeeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E866B7] mx-auto mb-4" />
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  // Show error state if employee fetch failed
  if (isEditMode && employeeError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p>Error loading employee: {employeeError}</p>
          <button 
            onClick={() => router.push('/dashboard/super-admin/team-space')}
            className="mt-4 px-4 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600"
          >
            Back to Employee List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          {isEditMode ? 'Edit Employee' : 'Add New Employee'}
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>All Employee</span>
          <span className="mx-2">{'>'}</span>
          <span>{isEditMode ? 'Edit Employee' : 'Add New Employee'}</span>
        </div>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {submitError}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'personal'
                ? 'border-[#FBB906] text-[#FBB906]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'job'
                ? 'border-[#FBB906] text-[#FBB906]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Job Information
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 ${
              activeTab === 'account'
                ? 'border-[#FBB906] text-[#FBB906]'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Key className="w-5 h-5 mr-2" />
            Account Access
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'personal' && <PersonalInfoTab />}
          {activeTab === 'job' && <JobInfoTab />}
          {activeTab === 'account' && <AccountAccessTab />}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 p-6 bg-gray-50 rounded-b-lg">
          <button
            onClick={handleCancel}
            disabled={isSubmitting || operationLoading}
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          {activeTab !== 'account' ? (
            <button
              onClick={handleNext}
              disabled={isSubmitting || operationLoading}
              className="px-6 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || operationLoading}
              className="px-6 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting || operationLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditMode ? 'Update Employee' : 'Add Employee'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AddEmployeePage = () => {
  return (
    <ProtectedRoute requiredRoles={['Super Admin', 'Admin']}>
      <AddNewEmployee />
    </ProtectedRoute>
  );
};

export default AddEmployeePage;