// Enhanced Employee Quality Assessment JavaScript - Updated Version

// Employee Database with expanded data
const employees = {
    'EMP001': {
        id: 'EMP001',
        password: 'password123',
        name: 'John Smith',
        role: 'Customer Service Representative',
        department: 'Customer Service',
        performanceScore: 4.7,
        attendanceRate: 96,
        email: 'john.smith@company.com',
        joinDate: '2023-03-15',
        lastLogin: null,
        goals: {
            monthly: { completed: 8, total: 10 },
            quarterly: { completed: 3, total: 4 }
        },
        metrics: {
            daily: {
                performanceScore: 4.5,
                taskCompletion: 85,
                customerSatisfaction: 4.5,
                teamCollaboration: 82,
                punctuality: 94,
                goals: { completed: 2, total: 3 }
            },
            weekly: {
                performanceScore: 4.6,
                taskCompletion: 87,
                customerSatisfaction: 4.6,
                teamCollaboration: 84,
                punctuality: 95,
                goals: { completed: 6, total: 8 }
            },
            monthly: {
                performanceScore: 4.7,
                taskCompletion: 88,
                customerSatisfaction: 4.6,
                teamCollaboration: 85,
                punctuality: 96,
                goals: { completed: 8, total: 10 }
            },
            annual: {
                performanceScore: 4.8,
                taskCompletion: 90,
                customerSatisfaction: 4.7,
                teamCollaboration: 87,
                punctuality: 97,
                goals: { completed: 38, total: 40 }
            }
        },
        leaveBalance: {
            vacation: 12,
            sick: 5,
            personal: 3
        }
    },
    'EMP002': {
        id: 'EMP002',
        password: 'password123',
        name: 'Sarah Johnson',
        role: 'Technical Support Specialist',
        department: 'Technical Support',
        performanceScore: 4.2,
        attendanceRate: 98,
        email: 'sarah.johnson@company.com',
        joinDate: '2022-11-08',
        lastLogin: null,
        goals: {
            monthly: { completed: 9, total: 10 },
            quarterly: { completed: 4, total: 4 }
        },
        metrics: {
            daily: {
                performanceScore: 4.1,
                taskCompletion: 89,
                customerSatisfaction: 4.3,
                teamCollaboration: 86,
                punctuality: 97,
                goals: { completed: 2, total: 3 }
            },
            weekly: {
                performanceScore: 4.2,
                taskCompletion: 91,
                customerSatisfaction: 4.4,
                teamCollaboration: 88,
                punctuality: 98,
                goals: { completed: 7, total: 8 }
            },
            monthly: {
                performanceScore: 4.2,
                taskCompletion: 92,
                customerSatisfaction: 4.4,
                teamCollaboration: 89,
                punctuality: 98,
                goals: { completed: 9, total: 10 }
            },
            annual: {
                performanceScore: 4.3,
                taskCompletion: 94,
                customerSatisfaction: 4.5,
                teamCollaboration: 91,
                punctuality: 99,
                goals: { completed: 39, total: 40 }
            }
        },
        leaveBalance: {
            vacation: 8,
            sick: 6,
            personal: 2
        }
    },
    'MGR001': {
        id: 'MGR001',
        password: 'manager123',
        name: 'Michael Brown',
        role: 'Department Manager',
        department: 'Operations',
        performanceScore: 4.9,
        attendanceRate: 99,
        email: 'michael.brown@company.com',
        joinDate: '2021-05-20',
        lastLogin: null,
        goals: {
            monthly: { completed: 10, total: 10 },
            quarterly: { completed: 4, total: 4 }
        },
        metrics: {
            daily: {
                performanceScore: 4.8,
                taskCompletion: 92,
                customerSatisfaction: 4.7,
                teamCollaboration: 91,
                punctuality: 98,
                goals: { completed: 3, total: 3 }
            },
            weekly: {
                performanceScore: 4.9,
                taskCompletion: 94,
                customerSatisfaction: 4.8,
                teamCollaboration: 93,
                punctuality: 99,
                goals: { completed: 8, total: 8 }
            },
            monthly: {
                performanceScore: 4.9,
                taskCompletion: 95,
                customerSatisfaction: 4.8,
                teamCollaboration: 94,
                punctuality: 99,
                goals: { completed: 10, total: 10 }
            },
            annual: {
                performanceScore: 5.0,
                taskCompletion: 97,
                customerSatisfaction: 4.9,
                teamCollaboration: 96,
                punctuality: 100,
                goals: { completed: 40, total: 40 }
            }
        },
        leaveBalance: {
            vacation: 15,
            sick: 8,
            personal: 5
        }
    }
};

// Application State
let currentEmployee = null;
let clockedIn = false;
let clockInTime = null;
let attendanceData = [];
let shiftBids = [];
let leaveRequests = [];
let currentStatsFilter = 'monthly';

// Timers to clear on logout
let dateTimeInterval = null;
let clockUpdateInterval = null;
let autoSaveInterval = null;

// Utility Functions
const utils = {
    // Toast notification system
    showToast: function(message, type = 'info') {
        try {
            const toast = document.createElement('div');
            toast.className = `toast toast-${type}`;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 24px;
                background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--info-color)'};
                color: white;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease;
                font-weight: 500;
                max-width: 350px;
                word-wrap: break-word;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => {
                        if (toast.parentNode) {
                            document.body.removeChild(toast);
                        }
                    }, 300);
                }
            }, 3000);
        } catch (error) {
            console.warn('Failed to show toast:', error);
        }
    },

    // Safe DOM element getter
    safeGetElement: function(id) {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.warn(`Element not found: ${id}`, error);
            return null;
        }
    },

    // Safe DOM content setter
    safeSetContent: function(elementId, content) {
        try {
            const element = this.safeGetElement(elementId);
            if (element) {
                element.textContent = content;
                return true;
            }
            return false;
        } catch (error) {
            console.warn(`Failed to set content for ${elementId}:`, error);
            return false;
        }
    },

    // Safe DOM HTML setter
    safeSetHTML: function(elementId, html) {
        try {
            const element = this.safeGetElement(elementId);
            if (element) {
                element.innerHTML = html;
                return true;
            }
            return false;
        } catch (error) {
            console.warn(`Failed to set HTML for ${elementId}:`, error);
            return false;
        }
    },

    // Form validation
    validateForm: function(formData, rules) {
        const errors = [];
        try {
            for (const field in rules) {
                const value = formData[field];
                const rule = rules[field];
                
                if (rule.required && (!value || value.trim() === '')) {
                    errors.push(`${field} is required`);
                }
                if (rule.minLength && value && value.length < rule.minLength) {
                    errors.push(`${field} must be at least ${rule.minLength} characters`);
                }
                if (rule.email && value && !this.isValidEmail(value)) {
                    errors.push(`${field} must be a valid email`);
                }
                if (rule.date && value && !this.isValidDate(value)) {
                    errors.push(`${field} must be a valid date`);
                }
            }
        } catch (error) {
            console.warn('Form validation error:', error);
            errors.push('Validation error occurred');
        }
        return errors;
    },

    isValidEmail: function(email) {
        try {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        } catch (error) {
            return false;
        }
    },

    isValidDate: function(dateString) {
        try {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        } catch (error) {
            return false;
        }
    },

    // Local storage helpers with better error handling
    saveToStorage: function(key, data) {
        try {
            if (typeof Storage !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(data));
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
            return false;
        }
    },

    loadFromStorage: function(key, defaultValue = null) {
        try {
            if (typeof Storage !== 'undefined') {
                const data = localStorage.getItem(key);
                return data ? JSON.parse(data) : defaultValue;
            }
            return defaultValue;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return defaultValue;
        }
    },

    // Calculate time difference
    calculateTimeDifference: function(startTime, endTime) {
        try {
            const diff = endTime - startTime;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            return { hours, minutes, total: diff };
        } catch (error) {
            console.warn('Time calculation error:', error);
            return { hours: 0, minutes: 0, total: 0 };
        }
    },

    // Format date for display
    formatDate: function(date, format = 'full') {
        try {
            const options = format === 'full' 
                ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
                : { year: 'numeric', month: '2-digit', day: '2-digit' };
            return date.toLocaleDateString('en-US', options);
        } catch (error) {
            console.warn('Date formatting error:', error);
            return 'Invalid Date';
        }
    }
};

// Data Management with improved error handling
const dataManager = {
    // Load all data from localStorage
    loadData: function() {
        try {
            attendanceData = utils.loadFromStorage('attendanceData', []);
            shiftBids = utils.loadFromStorage('shiftBids', []);
            leaveRequests = utils.loadFromStorage('leaveRequests', []);
            
            // Load employee-specific data
            if (currentEmployee) {
                const employeeData = utils.loadFromStorage(`employee_${currentEmployee.id}`, {});
                Object.assign(currentEmployee, employeeData);
            }
        } catch (error) {
            console.warn('Failed to load data:', error);
        }
    },

    // Save all data to localStorage
    saveData: function() {
        try {
            utils.saveToStorage('attendanceData', attendanceData);
            utils.saveToStorage('shiftBids', shiftBids);
            utils.saveToStorage('leaveRequests', leaveRequests);
            
            // Save employee-specific data
            if (currentEmployee) {
                utils.saveToStorage(`employee_${currentEmployee.id}`, currentEmployee);
            }
        } catch (error) {
            console.warn('Failed to save data:', error);
        }
    },

    // Add attendance record
    addAttendanceRecord: function(record) {
        try {
            record.employeeId = currentEmployee.id;
            record.id = Date.now();
            attendanceData.unshift(record);
            this.saveData();
            this.updateAttendanceDisplay();
        } catch (error) {
            console.warn('Failed to add attendance record:', error);
        }
    },

    // Add shift bid
    addShiftBid: function(bid) {
        try {
            bid.employeeId = currentEmployee.id;
            bid.id = Date.now();
            bid.submittedAt = new Date().toISOString();
            bid.status = 'Pending';
            shiftBids.unshift(bid);
            this.saveData();
            this.updateShiftBidsDisplay();
        } catch (error) {
            console.warn('Failed to add shift bid:', error);
        }
    },

    // Add leave request
    addLeaveRequest: function(request) {
        try {
            request.employeeId = currentEmployee.id;
            request.id = Date.now();
            request.submittedAt = new Date().toISOString();
            request.status = 'Pending';
            leaveRequests.unshift(request);
            this.saveData();
            this.updateLeaveRequestsDisplay();
        } catch (error) {
            console.warn('Failed to add leave request:', error);
        }
    },

    // Update displays with error handling
    updateAttendanceDisplay: function() {
        try {
            const tbody = utils.safeGetElement('attendanceHistory');
            if (!tbody || !currentEmployee) return;
            
            const employeeRecords = attendanceData.filter(record => record.employeeId === currentEmployee.id);
            utils.safeSetHTML('attendanceHistory', employeeRecords.slice(0, 10).map(record => `
                <tr>
                    <td>${utils.formatDate(new Date(record.date), 'short')}</td>
                    <td>${record.timeIn || '--:--'}</td>
                    <td>${record.timeOut || '--:--'}</td>
                    <td>${record.totalHours || '0h 0m'}</td>
                    <td class="status-${record.status.toLowerCase().replace(' ', '-')}">${record.status}</td>
                </tr>
            `).join(''));
        } catch (error) {
            console.warn('Failed to update attendance display:', error);
        }
    },

    updateShiftBidsDisplay: function() {
        try {
            const tbody = utils.safeGetElement('myShiftBids');
            if (!tbody || !currentEmployee) return;
            
            const employeeBids = shiftBids.filter(bid => bid.employeeId === currentEmployee.id);
            utils.safeSetHTML('myShiftBids', employeeBids.map(bid => `
                <tr>
                    <td>${bid.shiftName}</td>
                    <td>${bid.department}</td>
                    <td>${utils.formatDate(new Date(bid.submittedAt), 'short')}</td>
                    <td style="color: ${bid.status === 'Approved' ? 'var(--success-color)' : bid.status === 'Rejected' ? 'var(--danger-color)' : 'var(--warning-color)'}">${bid.status}</td>
                    <td>${currentEmployee.performanceScore}</td>
                    <td>${bid.status === 'Pending' ? `<button class="btn" style="font-size: 12px;" onclick="cancelShiftBid(${bid.id})">Cancel</button>` : '-'}</td>
                </tr>
            `).join(''));
        } catch (error) {
            console.warn('Failed to update shift bids display:', error);
        }
    },

    updateLeaveRequestsDisplay: function() {
        try {
            const tbody = utils.safeGetElement('leaveHistory');
            if (!tbody || !currentEmployee) return;
            
            const employeeRequests = leaveRequests.filter(request => request.employeeId === currentEmployee.id);
            utils.safeSetHTML('leaveHistory', employeeRequests.map(request => {
                const isUnlimited = ['emergency', 'maternity'].includes(request.type);
                const leaveTypeDisplay = request.type.charAt(0).toUpperCase() + request.type.slice(1);
                const typeWithBadge = isUnlimited ? 
                    `${leaveTypeDisplay} <span style="font-size: 10px; background: var(--success-color); color: white; padding: 2px 6px; border-radius: 12px;">UNLIMITED</span>` : 
                    leaveTypeDisplay;
                    
                return `
                    <tr>
                        <td>${typeWithBadge}</td>
                        <td>${request.startDate}</td>
                        <td>${request.endDate}</td>
                        <td>${request.days}</td>
                        <td style="color: ${request.status === 'Approved' ? 'var(--success-color)' : request.status === 'Rejected' ? 'var(--danger-color)' : 'var(--warning-color)'}">${request.status}</td>
                        <td>${request.status === 'Pending' ? `<button class="btn" style="font-size: 12px;" onclick="cancelLeaveRequest(${request.id})">Cancel</button>` : '-'}</td>
                    </tr>
                `;
            }).join(''));
        } catch (error) {
            console.warn('Failed to update leave requests display:', error);
        }
    }
};

// Clear all intervals
function clearAllIntervals() {
    try {
        if (dateTimeInterval) {
            clearInterval(dateTimeInterval);
            dateTimeInterval = null;
        }
        if (clockUpdateInterval) {
            clearInterval(clockUpdateInterval);
            clockUpdateInterval = null;
        }
        if (autoSaveInterval) {
            clearInterval(autoSaveInterval);
            autoSaveInterval = null;
        }
    } catch (error) {
        console.warn('Failed to clear intervals:', error);
    }
}

// Enhanced Application Logic

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    try {
        initializeApp();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
});

function initializeApp() {
    try {
        updateDateTime();
        dateTimeInterval = setInterval(updateDateTime, 1000);
        
        // Add CSS animations
        addCSSAnimations();
        
        // Initialize form listeners
        initializeFormListeners();
        
        // Initialize password toggle
        initializePasswordToggle();

        // Start auto-save
        autoSaveInterval = setInterval(function() {
            if (currentEmployee) {
                dataManager.saveData();
            }
        }, 30000); // Save every 30 seconds
        
    } catch (error) {
        console.warn('Initialization error:', error);
    }
}

function addCSSAnimations() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .pulse { animation: pulse 2s infinite; }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.warn('Failed to add animations:', error);
    }
}

function initializeFormListeners() {
    try {
        // Enhanced login form
        const loginForm = utils.safeGetElement('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }

        // Enhanced leave request form
        const leaveForm = utils.safeGetElement('leaveRequestForm');
        if (leaveForm) {
            leaveForm.addEventListener('submit', handleLeaveRequest);
        }

        // Date validation for leave requests
        const startDateInput = utils.safeGetElement('startDate');
        const endDateInput = utils.safeGetElement('endDate');
        
        if (startDateInput && endDateInput) {
            startDateInput.addEventListener('change', function() {
                endDateInput.min = this.value;
                if (endDateInput.value && endDateInput.value < this.value) {
                    endDateInput.value = this.value;
                }
            });
        }
    } catch (error) {
        console.warn('Failed to initialize form listeners:', error);
    }
}

// Password Show/Hide Toggle
function initializePasswordToggle() {
    try {
        const toggleBtn = utils.safeGetElement('togglePassword');
        const passwordInput = utils.safeGetElement('password');
        const toggleIcon = utils.safeGetElement('passwordToggleIcon');
        
        if (toggleBtn && passwordInput && toggleIcon) {
            toggleBtn.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                // Toggle icon
                toggleIcon.textContent = type === 'password' ? '👁️' : '🙈';
            });
        }
    } catch (error) {
        console.warn('Failed to initialize password toggle:', error);
    }
}

// Update current date and time
function updateDateTime() {
    try {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        utils.safeSetContent('currentDateTime', now.toLocaleDateString('en-US', options));
    } catch (error) {
        // Silent fail for date time update
    }
}

// Enhanced login functionality
function handleLogin(e) {
    try {
        e.preventDefault();
        const employeeIdEl = utils.safeGetElement('employeeId');
        const passwordEl = utils.safeGetElement('password');
        
        if (!employeeIdEl || !passwordEl) {
            utils.showToast('Login form not found', 'error');
            return;
        }

        const employeeId = employeeIdEl.value.trim();
        const password = passwordEl.value;

        // Validation
        if (!employeeId || !password) {
            utils.showToast('Please enter both Employee ID and Password', 'error');
            return;
        }

        // Check credentials
        if (employees[employeeId] && employees[employeeId].password === password) {
            currentEmployee = { ...employees[employeeId] };
            currentEmployee.lastLogin = new Date().toISOString();
            
            // Load employee data
            dataManager.loadData();
            
            showMainApp();
            utils.showToast(`Welcome back, ${currentEmployee.name}!`, 'success');
        } else {
            utils.showToast('Invalid Employee ID or Password', 'error');
            // Shake animation for login form
            const loginCard = document.querySelector('#loginPage .card');
            if (loginCard) {
                loginCard.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => {
                    loginCard.style.animation = '';
                }, 500);
            }
        }
    } catch (error) {
        console.warn('Login error:', error);
        utils.showToast('Login failed. Please try again.', 'error');
    }
}

// Show main application
function showMainApp() {
    try {
        const loginPage = utils.safeGetElement('loginPage');
        const mainApp = utils.safeGetElement('mainApp');
        
        if (loginPage) loginPage.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        utils.safeSetContent('welcomeMessage', `Welcome, ${currentEmployee.name}`);
        
        // Update dashboard with employee data
        updateDashboard();
        updatePersonalizedData();
        
        // Check for existing clock status
        const todayClockData = utils.loadFromStorage(`clock_${currentEmployee.id}_${new Date().toDateString()}`);
        if (todayClockData && todayClockData.clockedIn) {
            clockedIn = true;
            clockInTime = new Date(todayClockData.clockInTime);
            updateClockDisplay();
        }
    } catch (error) {
        console.warn('Failed to show main app:', error);
    }
}

function updateDashboard() {
    try {
        if (!currentEmployee) return;
        
        // Update stats cards with real data (weekly attendance without decimal)
        const weeklyAttendance = currentEmployee.metrics.weekly.punctuality; // Use weekly punctuality as attendance
        utils.safeSetContent('weeklyAttendance', `${Math.round(weeklyAttendance)}%`);
        
        // Use monthly goals for dashboard
        const monthlyGoals = currentEmployee.metrics.monthly.goals;
        utils.safeSetContent('monthlyGoals', `${monthlyGoals.completed}/${monthlyGoals.total}`);
        
        // Use overall performance score
        utils.safeSetContent('qualityScore', `${currentEmployee.performanceScore}/5`);
    } catch (error) {
        console.warn('Failed to update dashboard:', error);
    }
}

function updatePersonalizedData() {
    try {
        // Update quality metrics
        updateQualityMetrics();
        
        // Update leave balance
        updateLeaveBalance();
        
        // Load and display data
        dataManager.updateAttendanceDisplay();
        dataManager.updateShiftBidsDisplay();
        dataManager.updateLeaveRequestsDisplay();
    } catch (error) {
        console.warn('Failed to update personalized data:', error);
    }
}

function updateQualityMetrics() {
    try {
        if (!currentEmployee || !currentEmployee.metrics[currentStatsFilter]) return;
        
        const metrics = currentEmployee.metrics[currentStatsFilter];
        
        // Get period display name
        const periodDisplays = {
            'daily': 'today',
            'weekly': 'this week', 
            'monthly': 'this month',
            'annual': 'this year'
        };
        const periodText = periodDisplays[currentStatsFilter] || currentStatsFilter;
        
        // Update performance score (now dynamic per period)
        const performancePercentage = (metrics.performanceScore / 5) * 100;
        utils.safeSetContent('performanceScoreText', `${metrics.performanceScore}/5.0 (${Math.round(performancePercentage)}%)`);
        
        // Update task completion
        utils.safeSetContent('taskCompletionText', `${metrics.taskCompletion}% ${periodText}`);
        
        // Update customer satisfaction  
        utils.safeSetContent('customerSatText', `${metrics.customerSatisfaction}/5.0 average rating`);
        
        // Update team collaboration
        utils.safeSetContent('teamCollabText', `${metrics.teamCollaboration}% peer rating`);
        
        // Update punctuality
        utils.safeSetContent('punctualityText', `${metrics.punctuality}% on-time rate`);
        
        // Update goal achievement (now dynamic per period)
        const goalText = currentStatsFilter === 'daily' ? 'daily goals' :
                        currentStatsFilter === 'weekly' ? 'weekly goals' :
                        currentStatsFilter === 'monthly' ? 'monthly goals' : 'annual goals';
        utils.safeSetContent('goalAchievementText', `${metrics.goals.completed}/${metrics.goals.total} ${goalText} completed`);
        
        // Update progress bars by specific IDs
        const performanceBar = utils.safeGetElement('performanceBar');
        if (performanceBar) performanceBar.style.width = `${performancePercentage}%`;
        
        const taskCompletionBar = utils.safeGetElement('taskCompletionBar');
        if (taskCompletionBar) taskCompletionBar.style.width = `${metrics.taskCompletion}%`;
        
        const customerSatBar = utils.safeGetElement('customerSatBar');
        if (customerSatBar) customerSatBar.style.width = `${(metrics.customerSatisfaction / 5) * 100}%`;
        
        const teamCollabBar = utils.safeGetElement('teamCollabBar');
        if (teamCollabBar) teamCollabBar.style.width = `${metrics.teamCollaboration}%`;
        
        const punctualityBar = utils.safeGetElement('punctualityBar');
        if (punctualityBar) punctualityBar.style.width = `${metrics.punctuality}%`;
        
        const goalBar = utils.safeGetElement('goalBar');
        if (goalBar) goalBar.style.width = `${(metrics.goals.completed / metrics.goals.total) * 100}%`;
        
    } catch (error) {
        console.warn('Failed to update quality metrics:', error);
    }
}

function updateLeaveBalance() {
    try {
        if (!currentEmployee) return;
        
        const balance = currentEmployee.leaveBalance;
        const balanceElements = document.querySelectorAll('#leave .metric-item');
        
        if (balanceElements.length >= 3) {
            try {
                const vacationEl = balanceElements[0].querySelector('p');
                const vacationBar = balanceElements[0].querySelector('.progress-fill');
                if (vacationEl) vacationEl.innerHTML = `<strong>Vacation Days:</strong> ${balance.vacation} remaining`;
                if (vacationBar) vacationBar.style.width = `${(balance.vacation / 20) * 100}%`;
                
                const sickEl = balanceElements[1].querySelector('p');
                const sickBar = balanceElements[1].querySelector('.progress-fill');
                if (sickEl) sickEl.innerHTML = `<strong>Sick Days:</strong> ${balance.sick} remaining`;
                if (sickBar) sickBar.style.width = `${(balance.sick / 6) * 100}%`;
                
                const personalEl = balanceElements[2].querySelector('p');
                const personalBar = balanceElements[2].querySelector('.progress-fill');
                if (personalEl) personalEl.innerHTML = `<strong>Personal Days:</strong> ${balance.personal} remaining`;
                if (personalBar) personalBar.style.width = `${(balance.personal / 3) * 100}%`;
            } catch (error) {
                console.warn('Failed to update individual leave balance:', error);
            }
        }
    } catch (error) {
        console.warn('Failed to update leave balance:', error);
    }
}

// Enhanced logout functionality
function logout() {
    try {
        // Save current state
        if (currentEmployee) {
            dataManager.saveData();
            utils.saveToStorage(`clock_${currentEmployee.id}_${new Date().toDateString()}`, {
                clockedIn: clockedIn,
                clockInTime: clockInTime
            });
        }
        
        // Clear all intervals
        clearAllIntervals();
        
        // Reset state
        currentEmployee = null;
        clockedIn = false;
        clockInTime = null;
        
        // Show login page
        const loginPage = utils.safeGetElement('loginPage');
        const mainApp = utils.safeGetElement('mainApp');
        
        if (loginPage) loginPage.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
        
        // Clear form
        utils.safeSetContent('employeeId', '');
        utils.safeSetContent('password', '');
        
        utils.showToast('Logged out successfully', 'info');
        
        // Restart date time interval for login page
        dateTimeInterval = setInterval(updateDateTime, 1000);
        
    } catch (error) {
        console.warn('Logout error:', error);
    }
}

// Enhanced tab navigation
function showTab(tabName) {
    try {
        // Hide all tabs
        const tabs = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => tab.classList.add('hidden'));
        
        // Remove active class from all nav tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => tab.classList.remove('active'));
        
        // Show selected tab
        const targetTab = utils.safeGetElement(tabName);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }
        
        // Add active class to clicked nav tab
        if (event && event.target) {
            event.target.classList.add('active');
        }
        
        // Load tab-specific data
        loadTabData(tabName);
    } catch (error) {
        console.warn('Tab navigation error:', error);
    }
}

function loadTabData(tabName) {
    try {
        switch(tabName) {
            case 'quality':
                updateQualityMetrics();
                break;
            case 'attendance':
                dataManager.updateAttendanceDisplay();
                break;
            case 'shifts':
                dataManager.updateShiftBidsDisplay();
                break;
            case 'leave':
                dataManager.updateLeaveRequestsDisplay();
                updateLeaveBalance();
                break;
        }
    } catch (error) {
        console.warn('Failed to load tab data:', error);
    }
}

// Enhanced clock in/out functionality
function clockIn() {
    try {
        if (clockedIn) {
            utils.showToast('You are already clocked in!', 'warning');
            return;
        }
        
        clockedIn = true;
        clockInTime = new Date();
        
        // Save clock state
        utils.saveToStorage(`clock_${currentEmployee.id}_${new Date().toDateString()}`, {
            clockedIn: true,
            clockInTime: clockInTime.toISOString()
        });
        
        updateClockDisplay();
        utils.showToast('Successfully clocked in!', 'success');
        
        // Update attendance stats
        if (currentEmployee) {
            currentEmployee.attendanceRate = Math.min(100, currentEmployee.attendanceRate + 0.1);
            dataManager.saveData();
        }
    } catch (error) {
        console.warn('Clock in error:', error);
        utils.showToast('Failed to clock in. Please try again.', 'error');
    }
}

function clockOut() {
    try {
        if (!clockedIn) {
            utils.showToast('You are not clocked in!', 'warning');
            return;
        }
        
        const clockOutTime = new Date();
        const timeDiff = utils.calculateTimeDifference(clockInTime, clockOutTime);
        
        // Determine status
        const startOfDay = new Date(clockInTime);
        startOfDay.setHours(9, 0, 0, 0); // Assuming 9 AM start time
        const isLate = clockInTime > startOfDay;
        const status = isLate ? 'Late' : 'Present';
        
        // Create attendance record
        const attendanceRecord = {
            date: new Date().toISOString(),
            timeIn: clockInTime.toLocaleTimeString(),
            timeOut: clockOutTime.toLocaleTimeString(),
            totalHours: `${timeDiff.hours}h ${timeDiff.minutes}m`,
            status: status
        };
        
        dataManager.addAttendanceRecord(attendanceRecord);
        
        // Reset clock state
        clockedIn = false;
        clockInTime = null;
        
        // Clear saved clock state
        if (typeof Storage !== 'undefined') {
            localStorage.removeItem(`clock_${currentEmployee.id}_${new Date().toDateString()}`);
        }
        
        updateClockDisplay();
        utils.showToast(`Successfully clocked out! Total hours: ${attendanceRecord.totalHours}`, 'success');
    } catch (error) {
        console.warn('Clock out error:', error);
        utils.showToast('Failed to clock out. Please try again.', 'error');
    }
}

function updateClockDisplay() {
    try {
        const clockStatus = utils.safeGetElement('clockStatus');
        const lastClockAction = utils.safeGetElement('lastClockAction');
        const timeIn = utils.safeGetElement('timeIn');
        const timeOut = utils.safeGetElement('timeOut');
        const totalHours = utils.safeGetElement('totalHours');
        const dayStatus = utils.safeGetElement('dayStatus');
        const clockInBtn = utils.safeGetElement('clockInBtn');
        const clockOutBtn = utils.safeGetElement('clockOutBtn');
        
        if (clockedIn && clockInTime) {
            if (clockStatus) {
                clockStatus.textContent = 'Clocked In';
                clockStatus.className = 'status-present';
            }
            if (lastClockAction) lastClockAction.textContent = `Clocked in at ${clockInTime.toLocaleTimeString()}`;
            if (timeIn) timeIn.textContent = clockInTime.toLocaleTimeString();
            if (dayStatus) dayStatus.textContent = 'Working';
            if (clockInBtn) clockInBtn.disabled = true;
            if (clockOutBtn) clockOutBtn.disabled = false;
            
            // Update total hours in real-time
            if (clockUpdateInterval) clearInterval(clockUpdateInterval);
            clockUpdateInterval = setInterval(() => {
                try {
                    if (clockedIn && clockInTime && totalHours) {
                        const now = new Date();
                        const timeDiff = utils.calculateTimeDifference(clockInTime, now);
                        totalHours.textContent = `${timeDiff.hours}h ${timeDiff.minutes}m`;
                    }
                } catch (error) {
                    // Silent fail for clock update
                }
            }, 60000); // Update every minute
        } else {
            if (clockStatus) {
                clockStatus.textContent = 'Clocked Out';
                clockStatus.className = 'status-absent';
            }
            if (lastClockAction) lastClockAction.textContent = clockInTime ? `Last clocked out at ${new Date().toLocaleTimeString()}` : 'No activity today';
            if (dayStatus) dayStatus.textContent = 'Not Started';
            if (clockInBtn) clockInBtn.disabled = false;
            if (clockOutBtn) clockOutBtn.disabled = true;
        }
    } catch (error) {
        console.warn('Failed to update clock display:', error);
    }
}

// Enhanced shift bidding - Only 1 bid per quarter
function bidForShift(shiftType) {
    try {
        const shiftData = {
            'morning': {
                name: 'Morning Shift (6:00 AM - 2:00 PM)',
                department: 'Customer Service',
                requiredScore: 4.0
            },
            'afternoon': {
                name: 'Afternoon Shift (2:00 PM - 10:00 PM)',
                department: 'Technical Support',
                requiredScore: 3.5
            },
            'night': {
                name: 'Night Shift (10:00 PM - 6:00 AM)',
                department: 'Operations',
                requiredScore: 3.0
            }
        };
        
        const shift = shiftData[shiftType];
        if (!shift) return;
        
        if (currentEmployee.performanceScore < shift.requiredScore) {
            utils.showToast(`Your performance score (${currentEmployee.performanceScore}) is below the minimum requirement (${shift.requiredScore}) for this shift.`, 'error');
            return;
        }
        
        // Check if already has ANY active bid (limit 1 per quarter)
        const activeBids = shiftBids.filter(bid => 
            bid.employeeId === currentEmployee.id && 
            bid.status === 'Pending'
        );
        
        if (activeBids.length >= 1) {
            const existingBid = activeBids[0];
            utils.showToast(`You can only bid for one shift per quarter. You already have a pending bid for "${existingBid.shiftName}". Cancel it first to bid for a different shift.`, 'warning');
            return;
        }
        
        const bid = {
            shiftType: shiftType,
            shiftName: shift.name,
            department: shift.department,
            performanceScore: currentEmployee.performanceScore
        };
        
        dataManager.addShiftBid(bid);
        utils.showToast(`Shift bid submitted successfully! Your performance score: ${currentEmployee.performanceScore}`, 'success');
    } catch (error) {
        console.warn('Shift bidding error:', error);
        utils.showToast('Failed to submit shift bid. Please try again.', 'error');
    }
}

// Cancel shift bid function
function cancelShiftBid(bidId) {
    try {
        const bidIndex = shiftBids.findIndex(bid => bid.id === bidId);
        if (bidIndex !== -1) {
            shiftBids[bidIndex].status = 'Cancelled';
            dataManager.saveData();
            dataManager.updateShiftBidsDisplay();
            utils.showToast('Shift bid cancelled successfully. You can now bid for another shift.', 'info');
        }
    } catch (error) {
        console.warn('Cancel shift bid error:', error);
        utils.showToast('Failed to cancel shift bid. Please try again.', 'error');
    }
}

// Enhanced quality assessment filters
function filterStats(period) {
    try {
        currentStatsFilter = period;
        
        // Remove active class from all filter buttons
        const filterBtns = document.querySelectorAll('#quality .btn');
        filterBtns.forEach(btn => btn.classList.remove('btn-primary'));
        
        // Add active class to clicked button
        if (event && event.target) {
            event.target.classList.add('btn-primary');
        }
        
        // FORCE UPDATE - Manual data for each period
        const testData = {
            'daily': {
                performanceScore: 4.5,
                taskCompletion: 85,
                customerSatisfaction: 4.5,
                teamCollaboration: 82,
                punctuality: 94,
                goals: { completed: 2, total: 3 }
            },
            'weekly': {
                performanceScore: 4.6,
                taskCompletion: 87,
                customerSatisfaction: 4.6,
                teamCollaboration: 84,
                punctuality: 95,
                goals: { completed: 6, total: 8 }
            },
            'monthly': {
                performanceScore: 4.7,
                taskCompletion: 88,
                customerSatisfaction: 4.6,
                teamCollaboration: 85,
                punctuality: 96,
                goals: { completed: 8, total: 10 }
            },
            'annual': {
                performanceScore: 4.8,
                taskCompletion: 90,
                customerSatisfaction: 4.7,
                teamCollaboration: 87,
                punctuality: 97,
                goals: { completed: 38, total: 40 }
            }
        };
        
        const metrics = testData[period];
        
        // Force update texts
        const periodTexts = {
            'daily': 'today',
            'weekly': 'this week',
            'monthly': 'this month', 
            'annual': 'this year'
        };
        
        const goalTexts = {
            'daily': 'daily goals',
            'weekly': 'weekly goals',
            'monthly': 'monthly goals',
            'annual': 'annual goals'
        };
        
        // Update text content DIRECTLY
        document.getElementById('performanceScoreText').textContent = `${metrics.performanceScore}/5.0 (${Math.round((metrics.performanceScore/5)*100)}%)`;
        document.getElementById('taskCompletionText').textContent = `${metrics.taskCompletion}% ${periodTexts[period]}`;
        document.getElementById('customerSatText').textContent = `${metrics.customerSatisfaction}/5.0 average rating`;
        document.getElementById('teamCollabText').textContent = `${metrics.teamCollaboration}% peer rating`;
        document.getElementById('punctualityText').textContent = `${metrics.punctuality}% on-time rate`;
        document.getElementById('goalAchievementText').textContent = `${metrics.goals.completed}/${metrics.goals.total} ${goalTexts[period]} completed`;
        
        // Update progress bars DIRECTLY
        document.getElementById('performanceBar').style.width = `${(metrics.performanceScore/5)*100}%`;
        document.getElementById('taskCompletionBar').style.width = `${metrics.taskCompletion}%`;
        document.getElementById('customerSatBar').style.width = `${(metrics.customerSatisfaction/5)*100}%`;
        document.getElementById('teamCollabBar').style.width = `${metrics.teamCollaboration}%`;
        document.getElementById('punctualityBar').style.width = `${metrics.punctuality}%`;
        document.getElementById('goalBar').style.width = `${(metrics.goals.completed/metrics.goals.total)*100}%`;
        
        utils.showToast(`Viewing ${period} statistics`, 'info');
        
    } catch (error) {
        console.warn('Filter stats error:', error);
        alert(`Error: ${error.message}`);
    }
}

// Enhanced leave request handling
function handleLeaveRequest(e) {
    try {
        e.preventDefault();
        
        const formData = {
            type: utils.safeGetElement('leaveType')?.value,
            startDate: utils.safeGetElement('startDate')?.value,
            endDate: utils.safeGetElement('endDate')?.value,
            reason: utils.safeGetElement('reason')?.value?.trim()
        };
        
        // Validation
        const validationRules = {
            type: { required: true },
            startDate: { required: true, date: true },
            endDate: { required: true, date: true },
            reason: { required: true, minLength: 10 }
        };
        
        const errors = utils.validateForm(formData, validationRules);
        if (errors.length > 0) {
            utils.showToast(errors[0], 'error');
            return;
        }
        
        // Check date logic
        const startDate = new Date(formData.startDate);
        const endDate = new Date(formData.endDate);
        const today = new Date();
        
        if (startDate < today) {
            utils.showToast('Start date cannot be in the past', 'error');
            return;
        }
        
        if (endDate < startDate) {
            utils.showToast('End date cannot be before start date', 'error');
            return;
        }
        
        // Calculate days
        const timeDiff = endDate.getTime() - startDate.getTime();
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        
        // Check leave balance - Emergency and Maternity/Paternity are unlimited
        if (formData.type === 'emergency') {
            utils.showToast('Emergency leave approved automatically. No balance check required.', 'info');
        } else if (formData.type === 'maternity') {
            utils.showToast('Maternity/Paternity leave is statutory entitlement. No balance check required.', 'info');
        } else {
            // Check balance only for vacation, sick, and personal leave
            const leaveType = formData.type === 'vacation' ? 'vacation' : 
                             formData.type === 'sick' ? 'sick' : 'personal';
            
            if (currentEmployee.leaveBalance[leaveType] < days) {
                utils.showToast(`Insufficient ${leaveType} leave balance. You have ${currentEmployee.leaveBalance[leaveType]} days remaining.`, 'error');
                return;
            }
        }
        
        // Create leave request
        const leaveRequest = {
            ...formData,
            days: days,
            requestedDays: days,
            balanceRequired: !['emergency', 'maternity'].includes(formData.type)
        };
        
        dataManager.addLeaveRequest(leaveRequest);
        
        // Reset form
        const form = utils.safeGetElement('leaveRequestForm');
        if (form) form.reset();
        
        utils.showToast('Leave request submitted successfully!', 'success');
    } catch (error) {
        console.warn('Leave request error:', error);
        utils.showToast('Failed to submit leave request. Please try again.', 'error');
    }
}

// Cancel leave request
function cancelLeaveRequest(requestId) {
    try {
        const requestIndex = leaveRequests.findIndex(req => req.id === requestId);
        if (requestIndex !== -1) {
            leaveRequests[requestIndex].status = 'Cancelled';
            dataManager.saveData();
            dataManager.updateLeaveRequestsDisplay();
            utils.showToast('Leave request cancelled successfully', 'info');
        }
    } catch (error) {
        console.warn('Cancel leave request error:', error);
        utils.showToast('Failed to cancel leave request. Please try again.', 'error');
    }
}

// Enhanced forgot password functionality
function showForgotPassword() {
    try {
        const modal = utils.safeGetElement('forgotPasswordModal');
        if (modal) modal.classList.remove('hidden');
    } catch (error) {
        console.warn('Show forgot password error:', error);
    }
}

function closeForgotPassword() {
    try {
        const modal = utils.safeGetElement('forgotPasswordModal');
        if (modal) modal.classList.add('hidden');
        
        const resetInput = utils.safeGetElement('resetEmployeeId');
        if (resetInput) resetInput.value = '';
    } catch (error) {
        console.warn('Close forgot password error:', error);
    }
}

function resetPassword() {
    try {
        const employeeIdEl = utils.safeGetElement('resetEmployeeId');
        if (!employeeIdEl) return;
        
        const employeeId = employeeIdEl.value.trim();
        
        if (!employeeId) {
            utils.showToast('Please enter your Employee ID', 'error');
            return;
        }
        
        if (employees[employeeId]) {
            utils.showToast('Password reset instructions have been sent to your registered email address.', 'success');
            closeForgotPassword();
        } else {
            utils.showToast('Employee ID not found.', 'error');
        }
    } catch (error) {
        console.warn('Reset password error:', error);
        utils.showToast('Failed to process password reset. Please try again.', 'error');
    }
}

// New Functions for Dashboard Buttons

// View All Announcements
function viewAllAnnouncements() {
    try {
        const modal = utils.safeGetElement('announcementModal');
        const announcementsList = utils.safeGetElement('announcementsList');
        
        if (!modal || !announcementsList) return;
        
        const announcements = [
            {
                title: "Q2 Performance Results Released",
                date: "June 14, 2025",
                content: "Individual performance reports are now available in the Quality Assessment section. Please review your metrics and development recommendations.",
                priority: "high"
            },
            {
                title: "New Shift Bidding Period Opens",
                date: "June 12, 2025",
                content: "Q3 2025 shift bidding is now open until June 20th. Submit your preferences early for better chances.",
                priority: "medium"
            },
            {
                title: "Company All-Hands Meeting",
                date: "June 10, 2025",
                content: "Mandatory company meeting scheduled for June 18th at 2 PM. Agenda includes new policies and Q3 roadmap.",
                priority: "high"
            },
            {
                title: "System Maintenance Notice",
                date: "June 8, 2025",
                content: "Planned maintenance window on June 16th from 11 PM to 2 AM. Some features may be temporarily unavailable.",
                priority: "low"
            }
        ];
        
        announcementsList.innerHTML = announcements.map(announcement => `
            <div class="announcement-item">
                <h4>${announcement.title}</h4>
                <div class="date">${announcement.date}</div>
                <p>${announcement.content}</p>
            </div>
        `).join('');
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.warn('View announcements error:', error);
        utils.showToast('Failed to load announcements', 'error');
    }
}

// View Monthly Stars
function viewMonthlyStars() {
    try {
        const modal = utils.safeGetElement('employeeStarsModal');
        const employeeStarsList = utils.safeGetElement('employeeStarsList');
        
        if (!modal || !employeeStarsList) return;
        
        const stars = [
            {
                name: "Sarah Johnson",
                department: "Technical Support",
                achievement: "Achieved 98% customer satisfaction rating and resolved 150+ tickets this month",
                score: "4.8/5.0"
            },
            {
                name: "Michael Brown",
                department: "Operations",
                achievement: "Led successful implementation of new quality assessment system",
                score: "4.9/5.0"
            },
            {
                name: "John Smith",
                department: "Customer Service",
                achievement: "Exceeded monthly goals by 20% and maintained perfect attendance",
                score: "4.7/5.0"
            },
            {
                name: "Lisa Chen",
                department: "HR",
                achievement: "Improved employee onboarding process, reducing training time by 30%",
                score: "4.6/5.0"
            }
        ];
        
        employeeStarsList.innerHTML = stars.map(star => `
            <div class="employee-star-item">
                <h4>${star.name} - ${star.department}</h4>
                <div class="achievement">Performance Score: ${star.score}</div>
                <p>${star.achievement}</p>
            </div>
        `).join('');
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.warn('View monthly stars error:', error);
        utils.showToast('Failed to load employee stars', 'error');
    }
}

// IT Support Functions

// Check System Status
function checkSystemStatus() {
    try {
        const modal = utils.safeGetElement('systemStatusModal');
        const statusDetails = utils.safeGetElement('systemStatusDetails');
        
        if (!modal || !statusDetails) return;
        
        const systemServices = [
            { name: "Employee Portal", status: "online", uptime: "99.9%" },
            { name: "Attendance System", status: "online", uptime: "99.8%" },
            { name: "Shift Management", status: "online", uptime: "99.7%" },
            { name: "Leave Management", status: "maintenance", uptime: "95.2%" },
            { name: "Quality Assessment", status: "online", uptime: "99.9%" },
            { name: "Database Server", status: "online", uptime: "99.9%" }
        ];
        
        statusDetails.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h4>System Health Overview</h4>
                <p>Last checked: ${new Date().toLocaleString()}</p>
            </div>
            ${systemServices.map(service => `
                <div class="status-item ${service.status === 'online' ? '' : service.status}">
                    <div>
                        <strong>${service.name}</strong><br>
                        <small>Uptime: ${service.uptime}</small>
                    </div>
                    <div class="status-indicator ${service.status}">
                        ${service.status.toUpperCase()}
                    </div>
                </div>
            `).join('')}
        `;
        
        modal.classList.remove('hidden');
        utils.showToast('System status check completed', 'success');
    } catch (error) {
        console.warn('Check system status error:', error);
        utils.showToast('Failed to check system status', 'error');
    }
}

// Reset Employee Password
function resetEmployeePassword() {
    try {
        if (!currentEmployee) {
            utils.showToast('Please login first', 'error');
            return;
        }
        
        utils.showToast(`Password reset request submitted for ${currentEmployee.name}. You will receive an email with instructions.`, 'success');
    } catch (error) {
        console.warn('Reset employee password error:', error);
        utils.showToast('Failed to submit password reset request', 'error');
    }
}

// Contact IT Support
function contactITSupport() {
    try {
        const modal = utils.safeGetElement('itSupportModal');
        const supportForm = utils.safeGetElement('itSupportForm');
        
        if (!modal || !supportForm) return;
        
        supportForm.innerHTML = `
            <form id="itTicketForm">
                <div class="support-form-group">
                    <label for="ticketType">Issue Type:</label>
                    <select id="ticketType" required>
                        <option value="">Select issue type</option>
                        <option value="password">Password Reset</option>
                        <option value="access">Access Issues</option>
                        <option value="technical">Technical Problems</option>
                        <option value="feature">Feature Request</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div class="support-form-group">
                    <label for="ticketPriority">Priority:</label>
                    <select id="ticketPriority" required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>
                <div class="support-form-group">
                    <label for="ticketSubject">Subject:</label>
                    <input type="text" id="ticketSubject" required placeholder="Brief description of the issue">
                </div>
                <div class="support-form-group">
                    <label for="ticketDescription">Description:</label>
                    <textarea id="ticketDescription" rows="4" required placeholder="Detailed description of the issue"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Submit Ticket</button>
            </form>
        `;
        
        // Add form submit handler
        const form = utils.safeGetElement('itTicketForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                try {
                    e.preventDefault();
                    const ticketId = 'TK' + Date.now();
                    utils.showToast(`IT Support ticket ${ticketId} created successfully. You will receive an email confirmation.`, 'success');
                    closeModal('itSupportModal');
                } catch (error) {
                    console.warn('IT ticket submission error:', error);
                    utils.showToast('Failed to submit ticket. Please try again.', 'error');
                }
            });
        }
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.warn('Contact IT support error:', error);
        utils.showToast('Failed to open IT support form', 'error');
    }
}

// Update Software
function updateSoftware() {
    try {
        utils.showToast('Checking for software updates...', 'info');
        
        setTimeout(() => {
            try {
                const updates = [
                    "EQA System v2.1.5 - Bug fixes and performance improvements",
                    "Browser Security Update - Enhanced login security"
                ];
                
                utils.showToast(`Found ${updates.length} available updates. Installation will begin automatically.`, 'success');
                
                setTimeout(() => {
                    utils.showToast('Software updates installed successfully. Please refresh the page.', 'success');
                }, 3000);
            } catch (error) {
                console.warn('Software update error:', error);
                utils.showToast('Failed to install updates', 'error');
            }
        }, 2000);
    } catch (error) {
        console.warn('Update software error:', error);
        utils.showToast('Failed to check for updates', 'error');
    }
}

// Close Modal
function closeModal(modalId) {
    try {
        const modal = utils.safeGetElement(modalId);
        if (modal) modal.classList.add('hidden');
    } catch (error) {
        console.warn('Close modal error:', error);
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    try {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case '1':
                    e.preventDefault();
                    showTab('dashboard');
                    break;
                case '2':
                    e.preventDefault();
                    showTab('attendance');
                    break;
                case '3':
                    e.preventDefault();
                    showTab('shifts');
                    break;
                case '4':
                    e.preventDefault();
                    showTab('quality');
                    break;
                case '5':
                    e.preventDefault();
                    showTab('leave');
                    break;
                case '6':
                    e.preventDefault();
                    showTab('updates');
                    break;
            }
        }
        
        // Close modal on Escape key
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal:not(.hidden)');
            modals.forEach(modal => modal.classList.add('hidden'));
        }
    } catch (error) {
        // Silent fail for keyboard shortcuts
    }
});

// Improved error handling - only for critical errors, not every small issue
window.addEventListener('error', function(e) {
    // Only show error toast for critical errors
    if (e.error && e.error.name !== 'QuotaExceededError' && !e.error.message.includes('localStorage')) {
        console.error('Critical application error:', e.error);
        // Only show toast for critical errors that affect user experience
        if (e.error.message.includes('fetch') || e.error.message.includes('network') || e.error.message.includes('critical')) {
            utils.showToast('A critical error occurred. Please refresh the page.', 'error');
        }
    }
});

// Handle localStorage quota exceeded
window.addEventListener('storage', function(e) {
    try {
        if (e.key === null && typeof Storage !== 'undefined') {
            console.warn('LocalStorage cleared or quota exceeded');
        }
    } catch (error) {
        // Silent fail for storage events
    }
});