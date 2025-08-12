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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import './UserProfileForm.css';
var UserProfileForm = function (_a) {
    var mode = _a.mode, initialData = _a.initialData, onSubmit = _a.onSubmit, onCancel = _a.onCancel;
    var _b = useState({
        fullName: '',
        email: '',
        phone: '',
        addresses: [{ id: '1', street: '', city: '', state: '', zipCode: '' }]
    }), formData = _b[0], setFormData = _b[1];
    var _c = useState({}), errors = _c[0], setErrors = _c[1];
    var _d = useState(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    useEffect(function () {
        if (initialData) {
            setFormData({
                id: initialData.id || '',
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                addresses: initialData.addresses || [{ id: '1', street: '', city: '', state: '', zipCode: '' }]
            });
        }
    }, [initialData]);
    var validateForm = function () {
        var newErrors = {};
        // Validate basic fields
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }
        // Validate addresses
        var addressErrors = {};
        formData.addresses.forEach(function (address, index) {
            var addressError = {};
            if (!address.street.trim())
                addressError.street = 'Street is required';
            if (!address.city.trim())
                addressError.city = 'City is required';
            if (!address.state.trim())
                addressError.state = 'State is required';
            if (!address.zipCode.trim())
                addressError.zipCode = 'Zip code is required';
            if (Object.keys(addressError).length > 0) {
                addressErrors[address.id] = addressError;
            }
        });
        if (Object.keys(addressErrors).length > 0) {
            newErrors.addresses = addressErrors;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleInputChange = function (field, value) {
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[field] = value, _a)));
        });
        // Clear error when user starts typing
        if (field in errors && errors[field]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[field] = undefined, _a)));
            });
        }
    };
    var handleAddressChange = function (addressId, field, value) {
        var _a, _b;
        setFormData(function (prev) { return (__assign(__assign({}, prev), { addresses: prev.addresses.map(function (addr) {
                var _a;
                return addr.id === addressId ? __assign(__assign({}, addr), (_a = {}, _a[field] = value, _a)) : addr;
            }) })); });
        // Clear address field error when user starts typing
        if ((_b = (_a = errors.addresses) === null || _a === void 0 ? void 0 : _a[addressId]) === null || _b === void 0 ? void 0 : _b[field]) {
            var newAddressErrors_1 = __assign({}, errors.addresses);
            var addressError = __assign({}, newAddressErrors_1[addressId]);
            delete addressError[field];
            if (Object.keys(addressError).length === 0) {
                delete newAddressErrors_1[addressId];
            }
            else {
                newAddressErrors_1[addressId] = addressError;
            }
            setErrors(function (prev) { return (__assign(__assign({}, prev), { addresses: Object.keys(newAddressErrors_1).length > 0 ? newAddressErrors_1 : undefined })); });
        }
    };
    var addAddress = function () {
        var newId = Date.now().toString();
        setFormData(function (prev) { return (__assign(__assign({}, prev), { addresses: __spreadArray(__spreadArray([], prev.addresses, true), [{ id: newId, street: '', city: '', state: '', zipCode: '' }], false) })); });
    };
    var removeAddress = function (addressId) {
        var _a;
        if (formData.addresses.length > 1) {
            setFormData(function (prev) { return (__assign(__assign({}, prev), { addresses: prev.addresses.filter(function (addr) { return addr.id !== addressId; }) })); });
            // Remove errors for the removed address
            if ((_a = errors.addresses) === null || _a === void 0 ? void 0 : _a[addressId]) {
                var newAddressErrors_2 = __assign({}, errors.addresses);
                delete newAddressErrors_2[addressId];
                setErrors(function (prev) { return (__assign(__assign({}, prev), { addresses: Object.keys(newAddressErrors_2).length > 0 ? newAddressErrors_2 : undefined })); });
            }
        }
    };
    var handleSubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm())
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, onSubmit(formData)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Form submission error:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var isReadonly = mode === 'view';
    return (_jsxs("form", { onSubmit: handleSubmit, className: "user-profile-form", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "fullName", children: "Full Name *" }), _jsx("input", { id: "fullName", type: "text", value: formData.fullName, onChange: function (e) { return handleInputChange('fullName', e.target.value); }, readOnly: isReadonly, className: errors.fullName ? 'error' : '', "data-testid": "fullName-input" }), errors.fullName && _jsx("span", { className: "error-text", children: errors.fullName })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "email", children: "Email *" }), _jsx("input", { id: "email", type: "email", value: formData.email, onChange: function (e) { return handleInputChange('email', e.target.value); }, readOnly: isReadonly, className: errors.email ? 'error' : '', "data-testid": "email-input" }), errors.email && _jsx("span", { className: "error-text", children: errors.email })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "phone", children: "Phone *" }), _jsx("input", { id: "phone", type: "tel", value: formData.phone, onChange: function (e) { return handleInputChange('phone', e.target.value); }, readOnly: isReadonly, className: errors.phone ? 'error' : '', "data-testid": "phone-input" }), errors.phone && _jsx("span", { className: "error-text", children: errors.phone })] }), _jsxs("div", { className: "addresses-section", children: [_jsxs("div", { className: "addresses-header", children: [_jsx("h3", { children: "Addresses" }), !isReadonly && (_jsx("button", { type: "button", onClick: addAddress, className: "add-address-btn", "data-testid": "add-address-btn", children: "Add Address" }))] }), formData.addresses.map(function (address, index) {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
                        return (_jsxs("div", { className: "address-block", "data-testid": "address-block-".concat(index), children: [_jsxs("div", { className: "address-header", children: [_jsxs("h4", { children: ["Address ", index + 1] }), !isReadonly && formData.addresses.length > 1 && (_jsx("button", { type: "button", onClick: function () { return removeAddress(address.id); }, className: "remove-address-btn", "data-testid": "remove-address-".concat(index), children: "Remove" }))] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "street-".concat(address.id), children: "Street *" }), _jsx("input", { id: "street-".concat(address.id), type: "text", value: address.street, onChange: function (e) { return handleAddressChange(address.id, 'street', e.target.value); }, readOnly: isReadonly, className: ((_b = (_a = errors.addresses) === null || _a === void 0 ? void 0 : _a[address.id]) === null || _b === void 0 ? void 0 : _b.street) ? 'error' : '', "data-testid": "street-input-".concat(index) }), ((_d = (_c = errors.addresses) === null || _c === void 0 ? void 0 : _c[address.id]) === null || _d === void 0 ? void 0 : _d.street) && (_jsx("span", { className: "error-text", children: errors.addresses[address.id].street }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "city-".concat(address.id), children: "City *" }), _jsx("input", { id: "city-".concat(address.id), type: "text", value: address.city, onChange: function (e) { return handleAddressChange(address.id, 'city', e.target.value); }, readOnly: isReadonly, className: ((_f = (_e = errors.addresses) === null || _e === void 0 ? void 0 : _e[address.id]) === null || _f === void 0 ? void 0 : _f.city) ? 'error' : '', "data-testid": "city-input-".concat(index) }), ((_h = (_g = errors.addresses) === null || _g === void 0 ? void 0 : _g[address.id]) === null || _h === void 0 ? void 0 : _h.city) && (_jsx("span", { className: "error-text", children: errors.addresses[address.id].city }))] })] }), _jsxs("div", { className: "form-row", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "state-".concat(address.id), children: "State *" }), _jsx("input", { id: "state-".concat(address.id), type: "text", value: address.state, onChange: function (e) { return handleAddressChange(address.id, 'state', e.target.value); }, readOnly: isReadonly, className: ((_k = (_j = errors.addresses) === null || _j === void 0 ? void 0 : _j[address.id]) === null || _k === void 0 ? void 0 : _k.state) ? 'error' : '', "data-testid": "state-input-".concat(index) }), ((_m = (_l = errors.addresses) === null || _l === void 0 ? void 0 : _l[address.id]) === null || _m === void 0 ? void 0 : _m.state) && (_jsx("span", { className: "error-text", children: errors.addresses[address.id].state }))] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { htmlFor: "zipCode-".concat(address.id), children: "Zip Code *" }), _jsx("input", { id: "zipCode-".concat(address.id), type: "text", value: address.zipCode, onChange: function (e) { return handleAddressChange(address.id, 'zipCode', e.target.value); }, readOnly: isReadonly, className: ((_p = (_o = errors.addresses) === null || _o === void 0 ? void 0 : _o[address.id]) === null || _p === void 0 ? void 0 : _p.zipCode) ? 'error' : '', "data-testid": "zipCode-input-".concat(index) }), ((_r = (_q = errors.addresses) === null || _q === void 0 ? void 0 : _q[address.id]) === null || _r === void 0 ? void 0 : _r.zipCode) && (_jsx("span", { className: "error-text", children: errors.addresses[address.id].zipCode }))] })] })] }, address.id));
                    })] }), !isReadonly && (_jsxs("div", { className: "form-actions", children: [_jsx("button", { type: "submit", disabled: isSubmitting, className: "submit-btn", "data-testid": "submit-btn", children: isSubmitting ? 'Submitting...' : (mode === 'create' ? 'Create User' : 'Update User') }), onCancel && (_jsx("button", { type: "button", onClick: onCancel, className: "cancel-btn", "data-testid": "cancel-btn", children: "Cancel" }))] }))] }));
};
export default UserProfileForm;
