var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import UserProfileForm from './UserProfileForm';
var mockOnSubmit = jest.fn();
var mockOnCancel = jest.fn();
var mockUserData = {
    id: '1',
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    addresses: [
        {
            id: '1',
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
        }
    ]
};
describe('UserProfileForm', function () {
    beforeEach(function () {
        jest.clearAllMocks();
    });
    describe('Create Mode', function () {
        test('renders form with empty fields', function () {
            render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
            expect(screen.getByTestId('fullName-input')).toHaveValue('');
            expect(screen.getByTestId('email-input')).toHaveValue('');
            expect(screen.getByTestId('phone-input')).toHaveValue('');
            expect(screen.getByTestId('street-input-0')).toHaveValue('');
        });
        test('shows validation errors for empty required fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Full name is required')).toBeInTheDocument();
                                expect(screen.getByText('Email is required')).toBeInTheDocument();
                                expect(screen.getByText('Phone is required')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        test('validates email format', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
                        // Fill in ALL required fields EXCEPT make email invalid
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'John Doe' }
                        });
                        fireEvent.change(screen.getByTestId('email-input'), {
                            target: { value: 'invalid-email' }
                        });
                        fireEvent.change(screen.getByTestId('phone-input'), {
                            target: { value: '123-456-7890' }
                        });
                        fireEvent.change(screen.getByTestId('street-input-0'), {
                            target: { value: '123 Main St' }
                        });
                        fireEvent.change(screen.getByTestId('city-input-0'), {
                            target: { value: 'Anytown' }
                        });
                        fireEvent.change(screen.getByTestId('state-input-0'), {
                            target: { value: 'CA' }
                        });
                        fireEvent.change(screen.getByTestId('zipCode-input-0'), {
                            target: { value: '12345' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        // Wait a moment then verify form was not submitted
                        return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 100); })];
                    case 1:
                        // Wait a moment then verify form was not submitted
                        _a.sent();
                        // This is the actual test - onSubmit should not be called with invalid email
                        expect(mockOnSubmit).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        test('submits form with valid data', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
                        // Fill in form fields
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'John Doe' }
                        });
                        fireEvent.change(screen.getByTestId('email-input'), {
                            target: { value: 'john@example.com' }
                        });
                        fireEvent.change(screen.getByTestId('phone-input'), {
                            target: { value: '123-456-7890' }
                        });
                        fireEvent.change(screen.getByTestId('street-input-0'), {
                            target: { value: '123 Main St' }
                        });
                        fireEvent.change(screen.getByTestId('city-input-0'), {
                            target: { value: 'Anytown' }
                        });
                        fireEvent.change(screen.getByTestId('state-input-0'), {
                            target: { value: 'CA' }
                        });
                        fireEvent.change(screen.getByTestId('zipCode-input-0'), {
                            target: { value: '12345' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(mockOnSubmit).toHaveBeenCalledWith({
                                    fullName: 'John Doe',
                                    email: 'john@example.com',
                                    phone: '123-456-7890',
                                    addresses: [{
                                            id: expect.any(String),
                                            street: '123 Main St',
                                            city: 'Anytown',
                                            state: 'CA',
                                            zipCode: '12345'
                                        }]
                                });
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Edit Mode', function () {
        test('renders form with initial data', function () {
            render(_jsx(UserProfileForm, { mode: "edit", initialData: mockUserData, onSubmit: mockOnSubmit }));
            expect(screen.getByTestId('fullName-input')).toHaveValue('John Doe');
            expect(screen.getByTestId('email-input')).toHaveValue('john@example.com');
            expect(screen.getByTestId('phone-input')).toHaveValue('123-456-7890');
            expect(screen.getByTestId('street-input-0')).toHaveValue('123 Main St');
        });
        test('updates existing data on submit', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "edit", initialData: mockUserData, onSubmit: mockOnSubmit }));
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'Jane Doe' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(mockOnSubmit).toHaveBeenCalledWith(__assign(__assign({}, mockUserData), { fullName: 'Jane Doe' }));
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('View Mode', function () {
        test('renders form with readonly fields', function () {
            render(_jsx(UserProfileForm, { mode: "view", initialData: mockUserData, onSubmit: mockOnSubmit }));
            expect(screen.getByTestId('fullName-input')).toHaveAttribute('readonly');
            expect(screen.getByTestId('email-input')).toHaveAttribute('readonly');
            expect(screen.getByTestId('phone-input')).toHaveAttribute('readonly');
            expect(screen.queryByTestId('submit-btn')).not.toBeInTheDocument();
        });
        test('does not show add/remove address buttons', function () {
            render(_jsx(UserProfileForm, { mode: "view", initialData: mockUserData, onSubmit: mockOnSubmit }));
            expect(screen.queryByTestId('add-address-btn')).not.toBeInTheDocument();
            expect(screen.queryByTestId('remove-address-0')).not.toBeInTheDocument();
        });
    });
    describe('Dynamic Address Management', function () {
        test('adds new address block', function () {
            render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
            expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
            expect(screen.queryByTestId('address-block-1')).not.toBeInTheDocument();
            fireEvent.click(screen.getByTestId('add-address-btn'));
            expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
            expect(screen.getByTestId('address-block-1')).toBeInTheDocument();
        });
        test('removes address block', function () {
            render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
            // Add a second address
            fireEvent.click(screen.getByTestId('add-address-btn'));
            expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
            expect(screen.getByTestId('address-block-1')).toBeInTheDocument();
            // Remove second address
            fireEvent.click(screen.getByTestId('remove-address-1'));
            expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
            expect(screen.queryByTestId('address-block-1')).not.toBeInTheDocument();
        });
        test('prevents removing last address', function () {
            render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
            // Should not show remove button when only one address exists
            expect(screen.queryByTestId('remove-address-0')).not.toBeInTheDocument();
        });
        test('validates all address fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
                        // Fill required non-address fields
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'John Doe' }
                        });
                        fireEvent.change(screen.getByTestId('email-input'), {
                            target: { value: 'john@example.com' }
                        });
                        fireEvent.change(screen.getByTestId('phone-input'), {
                            target: { value: '123-456-7890' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Street is required')).toBeInTheDocument();
                                expect(screen.getByText('City is required')).toBeInTheDocument();
                                expect(screen.getByText('State is required')).toBeInTheDocument();
                                expect(screen.getByText('Zip code is required')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Cancel Functionality', function () {
        test('calls onCancel when cancel button is clicked', function () {
            render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit, onCancel: mockOnCancel }));
            fireEvent.click(screen.getByTestId('cancel-btn'));
            expect(mockOnCancel).toHaveBeenCalled();
        });
        test('does not show cancel button when onCancel is not provided', function () {
            render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
            expect(screen.queryByTestId('cancel-btn')).not.toBeInTheDocument();
        });
    });
    describe('Error Clearing', function () {
        test('clears field error when user starts typing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
                        // Trigger validation error
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Full name is required')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Start typing in field
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'J' }
                        });
                        expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
        test('clears address error when user starts typing', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: mockOnSubmit }));
                        // Fill required fields except address
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'John Doe' }
                        });
                        fireEvent.change(screen.getByTestId('email-input'), {
                            target: { value: 'john@example.com' }
                        });
                        fireEvent.change(screen.getByTestId('phone-input'), {
                            target: { value: '123-456-7890' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(screen.getByText('Street is required')).toBeInTheDocument();
                            })];
                    case 1:
                        _a.sent();
                        // Start typing in street field
                        fireEvent.change(screen.getByTestId('street-input-0'), {
                            target: { value: '1' }
                        });
                        expect(screen.queryByText('Street is required')).not.toBeInTheDocument();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Multiple Addresses', function () {
        test('handles multiple addresses correctly', function () {
            var multiAddressData = __assign(__assign({}, mockUserData), { addresses: [
                    {
                        id: '1',
                        street: '123 Main St',
                        city: 'Anytown',
                        state: 'CA',
                        zipCode: '12345'
                    },
                    {
                        id: '2',
                        street: '456 Oak Ave',
                        city: 'Somewhere',
                        state: 'NY',
                        zipCode: '67890'
                    }
                ] });
            render(_jsx(UserProfileForm, { mode: "edit", initialData: multiAddressData, onSubmit: mockOnSubmit }));
            expect(screen.getByTestId('address-block-0')).toBeInTheDocument();
            expect(screen.getByTestId('address-block-1')).toBeInTheDocument();
            expect(screen.getByTestId('street-input-0')).toHaveValue('123 Main St');
            expect(screen.getByTestId('street-input-1')).toHaveValue('456 Oak Ave');
        });
        test('allows editing individual address fields', function () { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        render(_jsx(UserProfileForm, { mode: "edit", initialData: mockUserData, onSubmit: mockOnSubmit }));
                        // Change street address
                        fireEvent.change(screen.getByTestId('street-input-0'), {
                            target: { value: '999 New Street' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        return [4 /*yield*/, waitFor(function () {
                                expect(mockOnSubmit).toHaveBeenCalledWith(__assign(__assign({}, mockUserData), { addresses: [__assign(__assign({}, mockUserData.addresses[0]), { street: '999 New Street' })] }));
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Form Submission States', function () {
        test('shows loading state during submission', function () { return __awaiter(void 0, void 0, void 0, function () {
            var slowSubmit;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        slowSubmit = jest.fn(function () { return new Promise(function (resolve) { return setTimeout(resolve, 100); }); });
                        render(_jsx(UserProfileForm, { mode: "create", onSubmit: slowSubmit }));
                        // Fill form with valid data
                        fireEvent.change(screen.getByTestId('fullName-input'), {
                            target: { value: 'John Doe' }
                        });
                        fireEvent.change(screen.getByTestId('email-input'), {
                            target: { value: 'john@example.com' }
                        });
                        fireEvent.change(screen.getByTestId('phone-input'), {
                            target: { value: '123-456-7890' }
                        });
                        fireEvent.change(screen.getByTestId('street-input-0'), {
                            target: { value: '123 Main St' }
                        });
                        fireEvent.change(screen.getByTestId('city-input-0'), {
                            target: { value: 'Anytown' }
                        });
                        fireEvent.change(screen.getByTestId('state-input-0'), {
                            target: { value: 'CA' }
                        });
                        fireEvent.change(screen.getByTestId('zipCode-input-0'), {
                            target: { value: '12345' }
                        });
                        fireEvent.click(screen.getByTestId('submit-btn'));
                        // Check loading state
                        expect(screen.getByText('Submitting...')).toBeInTheDocument();
                        expect(screen.getByTestId('submit-btn')).toBeDisabled();
                        // Wait for submission to complete
                        return [4 /*yield*/, waitFor(function () {
                                expect(slowSubmit).toHaveBeenCalled();
                            })];
                    case 1:
                        // Wait for submission to complete
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
