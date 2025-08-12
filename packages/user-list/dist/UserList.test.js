var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserList from './UserList';
var mockUsers = [
    {
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        addresses: [{
                id: '1',
                street: '123 Main St',
                city: 'Anytown',
                state: 'CA',
                zipCode: '12345'
            }]
    },
    {
        id: '2',
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        phone: '098-765-4321',
        addresses: [{
                id: '2',
                street: '456 Oak Ave',
                city: 'Somewhere',
                state: 'NY',
                zipCode: '67890'
            }]
    },
    {
        id: '3',
        fullName: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '555-123-4567',
        addresses: []
    }
];
var mockOnEdit = jest.fn();
var mockOnView = jest.fn();
var mockOnDelete = jest.fn();
describe('UserList', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('Basic Rendering', function () {
        test('renders user list with all users', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('Jane Smith')).toBeInTheDocument();
            expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        });
        test('displays correct user information', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
            expect(screen.getByText('123-456-7890')).toBeInTheDocument();
            expect(screen.getByText('123 Main St, Anytown, CA 12345')).toBeInTheDocument();
            expect(screen.getByText('No address')).toBeInTheDocument();
        });
        test('shows empty state when no users', function () {
            render(_jsx(UserList, { users: [], role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            expect(screen.getByTestId('empty-state')).toBeInTheDocument();
            expect(screen.getByText('No users available.')).toBeInTheDocument();
        });
    });
    describe('Role-based Permissions', function () {
        test('admin sees view, edit, and delete buttons', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, onDelete: mockOnDelete }));
            expect(screen.getByTestId('view-btn-1')).toBeInTheDocument();
            expect(screen.getByTestId('edit-btn-1')).toBeInTheDocument();
            expect(screen.getByTestId('delete-btn-1')).toBeInTheDocument();
        });
        test('supervisor sees view and edit buttons but no delete', function () {
            render(_jsx(UserList, { users: mockUsers, role: "supervisor", onEdit: mockOnEdit, onView: mockOnView, onDelete: mockOnDelete }));
            expect(screen.getByTestId('view-btn-1')).toBeInTheDocument();
            expect(screen.getByTestId('edit-btn-1')).toBeInTheDocument();
            expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
        });
        test('associate sees only view button', function () {
            render(_jsx(UserList, { users: mockUsers, role: "associate", onEdit: mockOnEdit, onView: mockOnView, onDelete: mockOnDelete }));
            expect(screen.getByTestId('view-btn-1')).toBeInTheDocument();
            expect(screen.queryByTestId('edit-btn-1')).not.toBeInTheDocument();
            expect(screen.queryByTestId('delete-btn-1')).not.toBeInTheDocument();
        });
    });
    describe('Search Functionality', function () {
        test('filters users by name', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: 'John' } });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('John Doe')).toBeInTheDocument();
                                expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('filters users by email', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: 'jane@' } });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
                                expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('filters users by phone', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: '555' } });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
                                expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('shows no results message when search has no matches', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('No users found matching your search.')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('case insensitive search', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: 'JOHN' } });
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('John Doe')).toBeInTheDocument();
                                expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Pagination', function () {
        var manyUsers = Array.from({ length: 25 }, function (_, i) { return ({
            id: "".concat(i + 1),
            fullName: "User ".concat(i + 1),
            email: "user".concat(i + 1, "@example.com"),
            phone: "".concat(i + 1, "23-456-7890"),
            addresses: []
        }); });
        test('shows pagination when users exceed itemsPerPage', function () {
            render(_jsx(UserList, { users: manyUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 10 }));
            expect(screen.getByTestId('page-1')).toBeInTheDocument();
            expect(screen.getByTestId('page-2')).toBeInTheDocument();
            expect(screen.getByTestId('page-3')).toBeInTheDocument();
            expect(screen.getByTestId('next-page')).toBeInTheDocument();
        });
        test('navigates to next page', function () {
            render(_jsx(UserList, { users: manyUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 10 }));
            expect(screen.getByText('User 1')).toBeInTheDocument();
            expect(screen.queryByText('User 11')).not.toBeInTheDocument();
            fireEvent.click(screen.getByTestId('next-page'));
            expect(screen.queryByText('User 1')).not.toBeInTheDocument();
            expect(screen.getByText('User 11')).toBeInTheDocument();
        });
        test('disables previous button on first page', function () {
            render(_jsx(UserList, { users: manyUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 10 }));
            var prevButton = screen.getByTestId('prev-page');
            expect(prevButton).toBeDisabled();
        });
        test('disables next button on last page', function () {
            render(_jsx(UserList, { users: manyUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 10 }));
            // Go to last page
            fireEvent.click(screen.getByTestId('page-3'));
            var nextButton = screen.getByTestId('next-page');
            expect(nextButton).toBeDisabled();
        });
        test('resets to first page when search changes', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: manyUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 10 }));
                        // Go to page 2
                        fireEvent.click(screen.getByTestId('page-2'));
                        expect(screen.getByText('User 11')).toBeInTheDocument();
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: 'User 1' } });
                        return [4 /*yield*/, waitFor(function () {
                                // Should be back on first page showing search results
                                expect(screen.getByText('User 1')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('hides pagination when total pages is 1 or less', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 10 }));
            expect(screen.queryByTestId('page-1')).not.toBeInTheDocument();
            expect(screen.queryByTestId('next-page')).not.toBeInTheDocument();
            expect(screen.queryByTestId('prev-page')).not.toBeInTheDocument();
        });
    });
    describe('Action Callbacks', function () {
        test('calls onView when view button is clicked', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            fireEvent.click(screen.getByTestId('view-btn-1'));
            expect(mockOnView).toHaveBeenCalledWith(mockUsers[0]);
        });
        test('calls onEdit when edit button is clicked', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            fireEvent.click(screen.getByTestId('edit-btn-1'));
            expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
        });
        test('calls onDelete when delete button is clicked and confirmed', function () {
            // Mock window.confirm
            var originalConfirm = window.confirm;
            window.confirm = jest.fn().mockReturnValue(true);
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, onDelete: mockOnDelete }));
            fireEvent.click(screen.getByTestId('delete-btn-1'));
            expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete John Doe?');
            expect(mockOnDelete).toHaveBeenCalledWith('1');
            // Restore original confirm
            window.confirm = originalConfirm;
        });
        test('does not call onDelete when deletion is cancelled', function () {
            // Mock window.confirm
            var originalConfirm = window.confirm;
            window.confirm = jest.fn().mockReturnValue(false);
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, onDelete: mockOnDelete }));
            fireEvent.click(screen.getByTestId('delete-btn-1'));
            expect(window.confirm).toHaveBeenCalled();
            expect(mockOnDelete).not.toHaveBeenCalled();
            // Restore original confirm
            window.confirm = originalConfirm;
        });
    });
    describe('Results Info', function () {
        test('displays correct results count', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 2 }));
            expect(screen.getByText('Showing 2 of 3 users')).toBeInTheDocument();
        });
        test('updates results count after search', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        fireEvent.change(searchInput, { target: { value: 'John Doe' } });
                        return [4 /*yield*/, waitFor(function () {
                                // "John Doe" only matches one user exactly
                                expect(screen.getByText('Showing 1 of 1 users')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Custom Props', function () {
        test('uses custom search placeholder', function () {
            render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, searchPlaceholder: "Custom search placeholder" }));
            expect(screen.getByPlaceholderText('Custom search placeholder')).toBeInTheDocument();
        });
        test('uses custom items per page', function () {
            var manyUsers = Array.from({ length: 5 }, function (_, i) { return ({
                id: "".concat(i + 1),
                fullName: "User ".concat(i + 1),
                email: "user".concat(i + 1, "@example.com"),
                phone: "".concat(i + 1, "23-456-7890"),
                addresses: []
            }); });
            render(_jsx(UserList, { users: manyUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView, itemsPerPage: 2 }));
            expect(screen.getByText('User 1')).toBeInTheDocument();
            expect(screen.getByText('User 2')).toBeInTheDocument();
            expect(screen.queryByText('User 3')).not.toBeInTheDocument();
            expect(screen.getByTestId('page-3')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', function () {
        test('handles empty search gracefully', function () { return __awaiter(void 0, void 0, void 0, function () {
            var searchInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserList, { users: mockUsers, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
                        searchInput = screen.getByTestId('search-input');
                        // Search with spaces only
                        fireEvent.change(searchInput, { target: { value: '   ' } });
                        return [4 /*yield*/, waitFor(function () {
                                // Should show all users when search is only spaces
                                expect(screen.getByText('John Doe')).toBeInTheDocument();
                                expect(screen.getByText('Jane Smith')).toBeInTheDocument();
                                expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('handles users without addresses correctly', function () {
            var usersWithoutAddresses = [
                {
                    id: '1',
                    fullName: 'No Address User',
                    email: 'noaddress@example.com',
                    phone: '555-0000',
                    addresses: []
                }
            ];
            render(_jsx(UserList, { users: usersWithoutAddresses, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            expect(screen.getByText('No address')).toBeInTheDocument();
        });
        test('handles very long user data gracefully', function () {
            var userWithLongData = [
                {
                    id: '1',
                    fullName: 'This Is A Very Long Name That Should Not Break The Layout',
                    email: 'verylongemailaddressthatmightcauseissues@verylongdomainname.com',
                    phone: '555-123-4567-ext-99999',
                    addresses: [{
                            id: '1',
                            street: 'A Very Long Street Address That Goes On And On And Should Be Handled Gracefully',
                            city: 'VeryLongCityNameThatShouldNotBreakTheLayout',
                            state: 'CA',
                            zipCode: '12345'
                        }]
                }
            ];
            render(_jsx(UserList, { users: userWithLongData, role: "admin", onEdit: mockOnEdit, onView: mockOnView }));
            expect(screen.getByText('This Is A Very Long Name That Should Not Break The Layout')).toBeInTheDocument();
        });
    });
});
