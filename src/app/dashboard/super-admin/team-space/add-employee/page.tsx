'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  Calendar, 
  User, 
  Briefcase, 
  Key 
} from 'lucide-react';

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
  expectedWorkingDays: string;
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

const AddNewEmployee = () => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');
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
      expectedWorkingDays: '',
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

  const updateJobInfo = (field: keyof JobInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      jobInfo: {
        ...prev.jobInfo,
        [field]: value
      }
    }));
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

  // API integration placeholder functions
  const handleNext = async () => {
    if (activeTab === 'personal') {
      setActiveTab('job');
    } else if (activeTab === 'job') {
      setActiveTab('account');
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Employee data to submit:', formData);
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };

  const handleCancel = () => {

    console.log('Cancel action');
  };

  // Reusable Input Component
  const InputField = ({ 
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
  }) => (
    <div className="flex flex-col space-y-2">
      <input
        type={type}
        placeholder={placeholder || label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent text-sm"
      />
    </div>
  );

  // Reusable Select Component
  const SelectField = ({ 
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
  }) => (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
          options={['Single', 'Married', 'Divorced', 'Widowed']}
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
          options={['Nigerian', 'American', 'British', 'Other']}
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
          label="Work Type"
          value={formData.jobInfo.workType}
          onChange={(value) => updateJobInfo('workType', value)}
          options={['Full time', 'Part time', 'Contract', 'Remote']}
          placeholder="Full time or remote"
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
          options={['Front Desk', 'Sales Rep', 'Accounting']}
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
        <SelectField
          label="Expected Working Days"
          value={formData.jobInfo.expectedWorkingDays}
          onChange={(value) => updateJobInfo('expectedWorkingDays', value)}
          options={['Monday - Friday', 'Monday - Saturday', 'Flexible', 'Shift Based']}
          placeholder="Type Expected Working Days"
        />
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

        </div>
      <SelectField
        label="Branch Location"
        value={formData.jobInfo.branchLocation}
        onChange={(value) => updateJobInfo('branchLocation', value)}
        options={['Ikeja Branch', 'Lekki Branch', 'Gbagada Branch']}
        placeholder="Select Branch Location"
      />
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
        options={['Admin', 'Manager', 'Employee', 'HR', 'Finance']}
        placeholder="Type System role"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Add New Employee</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>All Employee</span>
          <span className="mx-2">{'>'}</span>
          <span>Add New Employee</span>
        </div>
      </div>

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
            className="px-6 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          {activeTab !== 'account' ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#E866B7] text-white rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewEmployee;