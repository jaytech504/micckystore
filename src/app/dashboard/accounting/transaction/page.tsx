'use client';

import Link from 'next/link';
import { Search, ChevronDown, Plus, Download } from 'lucide-react';
import { useState } from 'react';
import { useInvoices } from '../../../../hooks/useInvoices';
import { accountingApi } from '../../../../api/accountingApi';
import { branchesApi, Branch } from '../../../../api/branchesApi';
import { useEffect } from 'react';

interface DropdownProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder: string;
}

interface BranchOption {
  value: string;
  label: string;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  branch: string;
  amount: string;
  status: string;
}

interface Invoice {
  date: string;
  number: string;
  orderId: string;
  status: string;
  customer: string;
  dueDate: string;
  balance: string;
  branch: string;
}

const TransactionsPage = () => {
  const [locationOpen, setLocationOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [branchFilterOpen, setBranchFilterOpen] = useState(false);
  const [categoryFilterOpen, setCategoryFilterOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('All Branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPage, setTransactionsPage] = useState(1);
  
  // Transactions API state
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [transactionsPagination, setTransactionsPagination] = useState<any>(null);

  // Branches API state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  // Invoices API integration
  const {
    data: invoices,
    loading: invoicesLoading,
    error: invoicesError,
    pagination: invoicesPagination
  } = useInvoices({
    page: currentPage,
    limit: 10,
    search: searchTerm || undefined,
    branch: selectedLocation !== 'All Branches' ? selectedLocation : undefined,
    status: selectedStatus !== 'All Status' ? selectedStatus.toLowerCase().replace(' ', '_') as any : undefined
  });

  // Dynamic branch options from API
  const branchOptions: BranchOption[] = [
    { value: 'All Branches', label: 'All Branches' },
    ...branches.map(branch => ({
      value: branch._id,
      label: branch.name
    }))
  ];

  const dateRanges: string[] = ['Today', 'This Week', 'This Month', 'Last Month', 'Custom'];
  const categories: string[] = ['All Categories', 'Repairs', 'Expenses', 'Budget', 'Sales'];
  const statuses: string[] = ['All Status', 'Approved', 'Unpaid', 'Paid', 'Pending'];

  const mockTransactions: Transaction[] = [
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "AC Maintenance",
      category: "Repairs",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "approved"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "Vendor payment",
      category: "Expenses",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "unpaid"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "Instagram Ads Budget",
      category: "Budget",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "paid"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "Invoice for Phone Sales",
      category: "Sales",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "paid"
    },
    {
      id: "TXN-10325",
      date: "06-06-2025",
      description: "NEPA Bill",
      category: "Expense",
      branch: "Gbagada",
      amount: "₦15,000.00",
      status: "paid"
    }
  ];

  // Fetch branches
  const fetchBranches = async () => {
    setBranchesLoading(true);
    setBranchesError(null);
    try {
      const response = await branchesApi.getBranches({
        status: 'Active',
        limit: 100
      });
      if (response.data?.branches) {
        setBranches(response.data.branches);
      }
    } catch (err: any) {
      console.error('Error loading branches:', err);
      setBranchesError('Failed to load branches');
    } finally {
      setBranchesLoading(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setTransactionsLoading(true);
    setTransactionsError(null);
    try {
      const params = {
        page: transactionsPage,
        limit: 10,
        search: searchTerm || undefined,
        category: selectedCategory !== 'All Categories' ? selectedCategory.toLowerCase() as any : undefined,
        status: selectedStatus !== 'All Status' ? selectedStatus.toLowerCase() as any : undefined
      };
      
      const response = await accountingApi.getTransactions(params);
      setTransactions(response.data.data);
      setTransactionsPagination(response.data.pagination);
    } catch (err: any) {
      setTransactionsError(err.message || 'Failed to fetch transactions');
    } finally {
      setTransactionsLoading(false);
    }
  };

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch transactions on mount and when filters change
  useEffect(() => {
    fetchTransactions();
  }, [transactionsPage, searchTerm, selectedCategory, selectedStatus]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
    setTransactionsPage(1); // Reset transactions page too
  };

  const Dropdown: React.FC<DropdownProps> = ({ isOpen, setIsOpen, options, selected, onSelect, placeholder }) => (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors flex items-center gap-2 min-w-[120px] justify-between"
      >
        <span>{selected || placeholder}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const LocationDropdown = () => (
    <div className="relative">
      <button
        onClick={() => setLocationOpen(!locationOpen)}
        className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:border-gray-300 transition-colors"
      >
        <span className="text-sm text-gray-600">Location:</span>
        <span className="text-sm text-amber-500 font-medium">
          {branchesLoading ? 'Loading...' : selectedLocation}
        </span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${locationOpen ? 'rotate-180' : ''}`} />
      </button>
      {locationOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
          {branchOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                setSelectedLocation(option.label);
                setLocationOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const getStatusStyles = (status: string): string => {
    const styles: { [key: string]: string } = {
      approved: "bg-green-100 text-green-800",
      unpaid: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-600",
      "partially-paid": "bg-blue-100 text-blue-800"
    };
    return styles[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header with Last Update */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
          <div>
            <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 mb-2">Transaction</h1>
            <p className="text-gray-600 text-sm">Monitor all financial activities, revenue, expenses, and invoices.</p>
          </div>
          <div className="text-sm text-gray-500 mt-4 lg:mt-0">
            Last Update: Current date and time
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-4 h-4" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-16 py-2.5 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E866B7] focus:border-transparent"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
            ⌘ K
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Location Dropdown */}
          <div className="flex items-center gap-2">
           <LocationDropdown />
          </div>

          {/* Add Transaction Button */}
          <Link
            href="/dashboard/accounting/transaction/add-new"
            className="bg-[#E866B7] text-white px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 relative">
        <h3 className='text-xl font-semibold text-gray-700 pr-17'>Transaction</h3>

        <Dropdown
          isOpen={dateFilterOpen}
          setIsOpen={setDateFilterOpen}
          options={dateRanges}
          selected="Date"
          onSelect={(option: string) => console.log('Date filter:', option)}
          placeholder="Date"
        />
        
        <Dropdown
          isOpen={branchFilterOpen}
          setIsOpen={setBranchFilterOpen}
          options={branchOptions.map(branch => branch.label)}
          selected={branchesLoading ? "Loading..." : "Branch"}
          onSelect={(option: string) => {
            const branch = branchOptions.find(b => b.label === option);
            if (branch && branch.value !== 'All Branches') {
              // Filter transactions by branch
              console.log('Branch filter:', branch.value);
            }
          }}
          placeholder={branchesLoading ? "Loading branches..." : "Branch"}
        />
        
        <Dropdown
          isOpen={categoryFilterOpen}
          setIsOpen={setCategoryFilterOpen}
          options={categories}
          selected={selectedCategory}
          onSelect={(option: string) => {
            setSelectedCategory(option);
            setTransactionsPage(1);
          }}
          placeholder="Category"
        />
        
        <Dropdown
          isOpen={statusFilterOpen}
          setIsOpen={setStatusFilterOpen}
          options={statuses}
          selected={selectedStatus}
          onSelect={(option: string) => {
            setSelectedStatus(option);
            setCurrentPage(1);
          }}
          placeholder="Status"
        />

        {/* Export Button */}
        <Link
          href="/transactions/export"
          className="ml-auto bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-300 transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Link>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Transaction ID</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Branch</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactionsLoading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactionsError ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                    Error loading transactions: {transactionsError}
                  </td>
                </tr>
              ) : transactions && transactions.length > 0 ? (
                transactions.map((transaction) => (
                <Link
                    key={transaction._id}
                    href={`/dashboard/accounting/transaction/transaction-details/${transaction._id}`}
                  className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4">
                    <span className="text-blue-600 text-sm font-medium">
                        {transaction.transaction_id}
                    </span>
                  </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{new Date(transaction.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">{transaction.description}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">{transaction.category}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{transaction.branch?.name || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">₦{transaction.amount.toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(transaction.status)}`}>
                      {transaction.status.replace('-', ' ')}
                    </span>
                  </td>
                </Link>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Transactions Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <button
            onClick={() => setTransactionsPage(prev => Math.max(1, prev - 1))}
            disabled={transactionsPage === 1}
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {transactionsPagination?.current_page || 1} of {transactionsPagination?.total_pages || 1}
          </span>
          <button
            onClick={() => setTransactionsPage(prev => prev + 1)}
            disabled={transactionsPage >= (transactionsPagination?.total_pages || 1)}
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Invoice Section */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 w-8">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Invoice number#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden md:table-cell">Order Id#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden xl:table-cell">Due date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Balance</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 hidden lg:table-cell">Branch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoicesLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    Loading invoices...
                  </td>
                </tr>
              ) : invoicesError ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-red-500">
                    Error loading invoices: {invoicesError}
                  </td>
                </tr>
              ) : invoices && invoices.length > 0 ? (
                invoices.map((invoice) => (
                <Link
                    key={invoice._id}
                    href={`/dashboard/accounting/transaction/invoice/${invoice._id}`}
                  className="table-row hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-4" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                  </td>
                    <td className="px-4 py-4 text-sm text-gray-900">{new Date(invoice.date_of_invoice).toLocaleDateString()}</td>
                  <td className="px-4 py-4">
                    <span className="text-blue-600 text-sm font-medium">
                        {invoice.invoice_receipt}
                    </span>
                  </td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden md:table-cell">System generated</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusStyles(invoice.status)}`}>
                      {invoice.status.replace('-', ' ')}
                    </span>
                  </td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{invoice.customer_name}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden xl:table-cell">{new Date(invoice.due_date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">₦{(invoice.sub_total + (invoice.delivery_fee || 0)).toLocaleString()}</td>
                    <td className="px-4 py-4 text-sm text-gray-900 hidden lg:table-cell">{invoice.branch?.name || 'N/A'}</td>
                </Link>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    No invoices found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Invoice Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-100">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {invoicesPagination?.current_page || 1} of {invoicesPagination?.total_pages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={currentPage >= (invoicesPagination?.total_pages || 1)}
            className="bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default TransactionsPage;