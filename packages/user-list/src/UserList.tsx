import React, { useState, useMemo } from 'react';
import { UserListProps, User, PaginationInfo } from './types';
import './UserList.css';

const UserList: React.FC<UserListProps> = ({
  users,
  role,
  onEdit,
  onView,
  onDelete,
  searchPlaceholder = 'Search users by name or email...',
  itemsPerPage = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user =>
      user.fullName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.phone.includes(term)
    );
  }, [users, searchTerm]);

  // Calculate pagination
  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = filteredUsers.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    return {
      currentPage,
      totalPages,
      totalItems,
      itemsPerPage
    };
  }, [filteredUsers.length, currentPage, itemsPerPage]);

  // Get current page users
  const currentPageUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const canEdit = role === 'admin' || role === 'supervisor';
  const canDelete = role === 'admin';

  const formatAddress = (user: User): string => {
    if (user.addresses.length === 0) return 'No address';
    const primaryAddress = user.addresses[0];
    return `${primaryAddress.street}, ${primaryAddress.city}, ${primaryAddress.state} ${primaryAddress.zipCode}`;
  };

  const renderPagination = () => {
    if (paginationInfo.totalPages <= 1) return null;

    const pages = [];
    const { currentPage, totalPages } = paginationInfo;

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
        data-testid="prev-page"
      >
        Previous
      </button>
    );

    // Page numbers (show max 5 pages around current)
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
          data-testid="page-1"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          data-testid={`page-${i}`}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
          data-testid={`page-${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
        data-testid="next-page"
      >
        Next
      </button>
    );

    return <div className="pagination">{pages}</div>;
  };

  return (
    <div className="user-list">
      <div className="user-list-header">
        <div className="search-container">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
            data-testid="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
        
        <div className="results-info">
          Showing {currentPageUsers.length} of {paginationInfo.totalItems} users
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          {searchTerm ? 'No users found matching your search.' : 'No users available.'}
        </div>
      ) : (
        <>
          <div className="user-table">
            <div className="table-header">
              <div className="header-cell">Name</div>
              <div className="header-cell">Email</div>
              <div className="header-cell">Phone</div>
              <div className="header-cell">Primary Address</div>
              <div className="header-cell">Actions</div>
            </div>
            
            {currentPageUsers.map((user) => (
              <div key={user.id} className="table-row" data-testid={`user-row-${user.id}`}>
                <div className="table-cell">{user.fullName}</div>
                <div className="table-cell">{user.email}</div>
                <div className="table-cell">{user.phone}</div>
                <div className="table-cell">{formatAddress(user)}</div>
                <div className="table-cell actions-cell">
                  <button
                    onClick={() => onView(user)}
                    className="action-btn view-btn"
                    data-testid={`view-btn-${user.id}`}
                  >
                    View
                  </button>
                  
                  {canEdit && (
                    <button
                      onClick={() => onEdit(user)}
                      className="action-btn edit-btn"
                      data-testid={`edit-btn-${user.id}`}
                    >
                      Edit
                    </button>
                  )}
                  
                  {canDelete && onDelete && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
                          onDelete(user.id);
                        }
                      }}
                      className="action-btn delete-btn"
                      data-testid={`delete-btn-${user.id}`}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default UserList;