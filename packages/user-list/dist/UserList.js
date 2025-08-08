import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useMemo } from 'react';
import "./UserList.css";
var UserList = function (_a) {
    var users = _a.users, role = _a.role, onEdit = _a.onEdit, onView = _a.onView, onDelete = _a.onDelete, _b = _a.searchPlaceholder, searchPlaceholder = _b === void 0 ? 'Search users by name or email...' : _b, _c = _a.itemsPerPage, itemsPerPage = _c === void 0 ? 10 : _c;
    var _d = useState(''), searchTerm = _d[0], setSearchTerm = _d[1];
    var _e = useState(1), currentPage = _e[0], setCurrentPage = _e[1];
    // Filter users based on search term
    var filteredUsers = useMemo(function () {
        if (!searchTerm.trim())
            return users;
        var term = searchTerm.toLowerCase();
        return users.filter(function (user) {
            return user.fullName.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term) ||
                user.phone.includes(term);
        });
    }, [users, searchTerm]);
    // Calculate pagination
    var paginationInfo = useMemo(function () {
        var totalItems = filteredUsers.length;
        var totalPages = Math.ceil(totalItems / itemsPerPage);
        return {
            currentPage: currentPage,
            totalPages: totalPages,
            totalItems: totalItems,
            itemsPerPage: itemsPerPage
        };
    }, [filteredUsers.length, currentPage, itemsPerPage]);
    // Get current page users
    var currentPageUsers = useMemo(function () {
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;
        return filteredUsers.slice(startIndex, endIndex);
    }, [filteredUsers, currentPage, itemsPerPage]);
    // Reset to first page when search changes
    var handleSearchChange = function (value) {
        setSearchTerm(value);
        setCurrentPage(1);
    };
    var handlePageChange = function (page) {
        if (page >= 1 && page <= paginationInfo.totalPages) {
            setCurrentPage(page);
        }
    };
    var canEdit = role === 'admin' || role === 'supervisor';
    var canDelete = role === 'admin';
    var formatAddress = function (user) {
        if (user.addresses.length === 0)
            return 'No address';
        var primaryAddress = user.addresses[0];
        return "".concat(primaryAddress.street, ", ").concat(primaryAddress.city, ", ").concat(primaryAddress.state, " ").concat(primaryAddress.zipCode);
    };
    var renderPagination = function () {
        if (paginationInfo.totalPages <= 1)
            return null;
        var pages = [];
        var currentPage = paginationInfo.currentPage, totalPages = paginationInfo.totalPages;
        // Previous button
        pages.push(_jsx("button", { onClick: function () { return handlePageChange(currentPage - 1); }, disabled: currentPage === 1, className: "pagination-btn", "data-testid": "prev-page", children: "Previous" }, "prev"));
        // Page numbers (show max 5 pages around current)
        var startPage = Math.max(1, currentPage - 2);
        var endPage = Math.min(totalPages, currentPage + 2);
        if (startPage > 1) {
            pages.push(_jsx("button", { onClick: function () { return handlePageChange(1); }, className: "pagination-btn", "data-testid": "page-1", children: "1" }, 1));
            if (startPage > 2) {
                pages.push(_jsx("span", { className: "pagination-ellipsis", children: "..." }, "ellipsis1"));
            }
        }
        var _loop_1 = function (i) {
            pages.push(_jsx("button", { onClick: function () { return handlePageChange(i); }, className: "pagination-btn ".concat(i === currentPage ? 'active' : ''), "data-testid": "page-".concat(i), children: i }, i));
        };
        for (var i = startPage; i <= endPage; i++) {
            _loop_1(i);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(_jsx("span", { className: "pagination-ellipsis", children: "..." }, "ellipsis2"));
            }
            pages.push(_jsx("button", { onClick: function () { return handlePageChange(totalPages); }, className: "pagination-btn", "data-testid": "page-".concat(totalPages), children: totalPages }, totalPages));
        }
        // Next button
        pages.push(_jsx("button", { onClick: function () { return handlePageChange(currentPage + 1); }, disabled: currentPage === totalPages, className: "pagination-btn", "data-testid": "next-page", children: "Next" }, "next"));
        return _jsx("div", { className: "pagination", children: pages });
    };
    return (_jsxs("div", { className: "user-list", children: [_jsxs("div", { className: "user-list-header", children: [_jsxs("div", { className: "search-container", children: [_jsx("input", { type: "text", placeholder: searchPlaceholder, value: searchTerm, onChange: function (e) { return handleSearchChange(e.target.value); }, className: "search-input", "data-testid": "search-input" }), _jsx("div", { className: "search-icon", children: "\uD83D\uDD0D" })] }), _jsxs("div", { className: "results-info", children: ["Showing ", currentPageUsers.length, " of ", paginationInfo.totalItems, " users"] })] }), filteredUsers.length === 0 ? (_jsx("div", { className: "empty-state", "data-testid": "empty-state", children: searchTerm ? 'No users found matching your search.' : 'No users available.' })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "user-table", children: [_jsxs("div", { className: "table-header", children: [_jsx("div", { className: "header-cell", children: "Name" }), _jsx("div", { className: "header-cell", children: "Email" }), _jsx("div", { className: "header-cell", children: "Phone" }), _jsx("div", { className: "header-cell", children: "Primary Address" }), _jsx("div", { className: "header-cell", children: "Actions" })] }), currentPageUsers.map(function (user) { return (_jsxs("div", { className: "table-row", "data-testid": "user-row-".concat(user.id), children: [_jsx("div", { className: "table-cell", children: user.fullName }), _jsx("div", { className: "table-cell", children: user.email }), _jsx("div", { className: "table-cell", children: user.phone }), _jsx("div", { className: "table-cell", children: formatAddress(user) }), _jsxs("div", { className: "table-cell actions-cell", children: [_jsx("button", { onClick: function () { return onView(user); }, className: "action-btn view-btn", "data-testid": "view-btn-".concat(user.id), children: "View" }), canEdit && (_jsx("button", { onClick: function () { return onEdit(user); }, className: "action-btn edit-btn", "data-testid": "edit-btn-".concat(user.id), children: "Edit" })), canDelete && onDelete && (_jsx("button", { onClick: function () {
                                                    if (window.confirm("Are you sure you want to delete ".concat(user.fullName, "?"))) {
                                                        onDelete(user.id);
                                                    }
                                                }, className: "action-btn delete-btn", "data-testid": "delete-btn-".concat(user.id), children: "Delete" }))] })] }, user.id)); })] }), renderPagination()] }))] }));
};
export default UserList;
