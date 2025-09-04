// Admin Panel JavaScript

// Configuration
const ADMIN_PASSWORD = "anIdiotsLuggage";
const STORAGE_KEY = "matthewPortfolioProjects";

// State
let projects = [];
let isAuthenticated = false;
let editingProjectId = null;

// DOM Elements
const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("passwordInput");
const loginError = document.getElementById("loginError");
const logoutBtn = document.getElementById("logoutBtn");
const addProjectBtn = document.getElementById("addProjectBtn");
const projectsList = document.getElementById("projectsList");
const projectModal = document.getElementById("projectModal");
const projectForm = document.getElementById("projectForm");
const modalTitle = document.getElementById("modalTitle");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");
const deleteModal = document.getElementById("deleteModal");
const deleteProjectName = document.getElementById("deleteProjectName");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

// Initialize
document.addEventListener("DOMContentLoaded", init);

function init() {
    loadProjects();
    setupEventListeners();

    // Check if already authenticated (for development)
    const isAuth = sessionStorage.getItem("adminAuthenticated");
    if (isAuth === "true") {
        showAdminPanel();
    }
}

// Event Listeners
function setupEventListeners() {
    // Login
    loginForm.addEventListener("submit", handleLogin);

    // Logout
    logoutBtn.addEventListener("click", handleLogout);

    // Modal controls
    addProjectBtn.addEventListener("click", showAddProjectModal);
    closeModal.addEventListener("click", hideProjectModal);
    cancelBtn.addEventListener("click", hideProjectModal);

    // Project form
    projectForm.addEventListener("submit", handleProjectSubmit);

    // Image upload
    const imageInput = document.getElementById("projectImage");
    const imagePreview = document.getElementById("imagePreview");

    imageInput.addEventListener("change", handleImageUpload);
    imagePreview.addEventListener("click", () => imageInput.click());
    imagePreview.addEventListener("dragover", handleDragOver);
    imagePreview.addEventListener("drop", handleImageDrop);

    // Delete modal
    cancelDeleteBtn.addEventListener("click", hideDeleteModal);
    confirmDeleteBtn.addEventListener("click", confirmDelete);

    // Close modals on outside click
    projectModal.addEventListener("click", (e) => {
        if (e.target === projectModal) hideProjectModal();
    });

    deleteModal.addEventListener("click", (e) => {
        if (e.target === deleteModal) hideDeleteModal();
    });
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const password = passwordInput.value.trim();

    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        sessionStorage.setItem("adminAuthenticated", "true");
        showAdminPanel();
        loginError.textContent = "";
    } else {
        loginError.textContent = "Incorrect password. Please try again.";
        passwordInput.value = "";
        passwordInput.focus();

        // Add shake animation
        loginForm.style.animation = "shake 0.5s ease-in-out";
        setTimeout(() => {
            loginForm.style.animation = "";
        }, 500);
    }
}

function handleLogout() {
    isAuthenticated = false;
    sessionStorage.removeItem("adminAuthenticated");
    showLoginScreen();
}

function showAdminPanel() {
    loginScreen.style.display = "none";
    adminPanel.style.display = "block";
    renderProjects();
}

function showLoginScreen() {
    loginScreen.style.display = "flex";
    adminPanel.style.display = "none";
    passwordInput.value = "";
    loginError.textContent = "";
}

// Project Management
function loadProjects() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            projects = JSON.parse(saved);
        } catch (error) {
            console.error("Error loading projects:", error);
            projects = getDefaultProjects();
        }
    } else {
        projects = getDefaultProjects();
        saveProjects();
    }
}

function getDefaultProjects() {
    return [
        {
            id: 1,
            title: "Quadratic Formula Solver",
            description:
                "A web-based calculator that solves quadratic equations and displays the solutions with step-by-step explanations.",
            image: "images/QuadraticFormulaScreenshot.png",
            link: "https://rippey-fam.github.io/Website-Builds/Projects/QuadraticFormula/",
            date: new Date().toISOString(),
        },
        {
            id: 2,
            title: "Cryptogram Game",
            description:
                "An interactive puzzle game where players decode encrypted messages using letter substitution ciphers.",
            image: "images/CryptogramScreenshot.png",
            link: "https://rippey-fam.github.io/Website-Builds/Projects/Cryptogram/",
            date: new Date().toISOString(),
        },
    ];
}

function saveProjects() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
        console.error("Error saving projects:", error);
        alert("Error saving projects. Please try again.");
    }
}

function renderProjects() {
    if (!projectsList) return;

    const sortedProjects = [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedProjects.length === 0) {
        projectsList.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <p>No projects yet. Click "Add New Project" to get started!</p>
            </div>
        `;
        return;
    }

    projectsList.innerHTML = sortedProjects
        .map(
            (project) => `
        <div class="admin-project-card" data-project-id="${project.id}">
            <div class="project-card-header">
                <div class="project-info">
                    <h3>${escapeHtml(project.title)}</h3>
                    <p>${escapeHtml(project.description)}</p>
                </div>
                <div class="project-actions">
                    <button class="edit-btn" onclick="editProject(${project.id})" title="Edit Project">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProject(${project.id})" title="Delete Project">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="project-meta">
                <a href="${project.link}" target="_blank" rel="noopener" class="project-link-preview">
                    <i class="fas fa-external-link-alt"></i>
                    View Project
                </a>
                <span>Added: ${formatDate(project.date)}</span>
            </div>
        </div>
    `,
        )
        .join("");
}

// Modal Management
function showAddProjectModal() {
    editingProjectId = null;
    modalTitle.textContent = "Add New Project";
    document.getElementById("saveBtn").innerHTML = '<i class="fas fa-plus"></i> Add Project';
    resetProjectForm();
    showModal(projectModal);
}

function showEditProjectModal(project) {
    editingProjectId = project.id;
    modalTitle.textContent = "Edit Project";
    document.getElementById("saveBtn").innerHTML = '<i class="fas fa-save"></i> Update Project';

    // Populate form
    document.getElementById("projectId").value = project.id;
    document.getElementById("projectTitle").value = project.title;
    document.getElementById("projectDescription").value = project.description;
    document.getElementById("projectLink").value = project.link;

    // Show existing image
    if (project.image) {
        const imagePreview = document.getElementById("imagePreview");
        imagePreview.innerHTML = `
            <img src="${project.image}" alt="Project preview">
            <span>Click to change image</span>
        `;
    }

    showModal(projectModal);
}

function hideProjectModal() {
    hideModal(projectModal);
    resetProjectForm();
}

function showDeleteModal(project) {
    deleteProjectName.textContent = project.title;
    confirmDeleteBtn.onclick = () => confirmDelete(project.id);
    showModal(deleteModal);
}

function hideDeleteModal() {
    hideModal(deleteModal);
}

function showModal(modal) {
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function hideModal(modal) {
    modal.classList.remove("show");
    document.body.style.overflow = "";
}

function resetProjectForm() {
    projectForm.reset();
    editingProjectId = null;

    // Reset image preview
    const imagePreview = document.getElementById("imagePreview");
    imagePreview.innerHTML = `
        <i class="fas fa-image"></i>
        <span>Choose an image or drag & drop</span>
    `;
}

// Project CRUD Operations
function handleProjectSubmit(e) {
    e.preventDefault();

    // Get form values directly from elements
    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDescription").value.trim();
    const link = document.getElementById("projectLink").value.trim();
    const imageFile = document.getElementById("projectImage").files[0];

    if (!title || !description || !link) {
        alert("Please fill in all required fields.");
        return;
    }

    // Validate URL format
    try {
        new URL(link);
    } catch {
        alert("Please enter a valid URL (including http:// or https://)");
        return;
    }

    if (editingProjectId) {
        updateProject(editingProjectId, title, description, link, imageFile);
    } else {
        addProject(title, description, link, imageFile);
    }
}

function addProject(title, description, link, imageFile) {
    const newId = Math.max(...projects.map((p) => p.id), 0) + 1;

    const project = {
        id: newId,
        title,
        description,
        link,
        image: imageFile
            ? URL.createObjectURL(imageFile)
            : "https://via.placeholder.com/400x200/2563eb/ffffff?text=Project+Image",
        date: new Date().toISOString(),
    };

    projects.push(project);
    saveProjects();
    renderProjects();
    hideProjectModal();

    showNotification("Project added successfully!", "success");
}

function updateProject(id, title, description, link, imageFile) {
    const projectIndex = projects.findIndex((p) => p.id === id);
    if (projectIndex === -1) return;

    const project = projects[projectIndex];
    project.title = title;
    project.description = description;
    project.link = link;

    // Update image only if a new one was selected
    if (imageFile) {
        project.image = URL.createObjectURL(imageFile);
    }

    saveProjects();
    renderProjects();
    hideProjectModal();

    showNotification("Project updated successfully!", "success");
}

function editProject(id) {
    const project = projects.find((p) => p.id === id);
    if (project) {
        showEditProjectModal(project);
    }
}

function deleteProject(id) {
    const project = projects.find((p) => p.id === id);
    if (project) {
        showDeleteModal(project);
    }
}

function confirmDelete(id) {
    projects = projects.filter((p) => p.id !== id);
    saveProjects();
    renderProjects();
    hideDeleteModal();

    showNotification("Project deleted successfully!", "success");
}

// Image Upload Handling
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        displayImagePreview(file);
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    e.target.style.borderColor = "var(--primary-color)";
    e.target.style.color = "var(--primary-color)";
}

function handleImageDrop(e) {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith("image/")) {
            document.getElementById("projectImage").files = files;
            displayImagePreview(file);
        } else {
            alert("Please drop an image file.");
        }
    }

    e.target.style.borderColor = "var(--border-color)";
    e.target.style.color = "var(--text-secondary)";
}

function displayImagePreview(file) {
    if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        alert("Image size should be less than 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const imagePreview = document.getElementById("imagePreview");
        imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Project preview">
            <span>Click to change image</span>
        `;
    };
    reader.readAsDataURL(file);
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function showNotification(message, type = "info") {
    // Remove existing notifications
    const existing = document.querySelector(".notification");
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : "fa-info-circle"}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#10b981" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;

    const style = document.createElement("style");
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 300);
    }, 3000);
}

// Export projects data (for backup)
function exportProjects() {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `portfolio-projects-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
}

// Import projects data
function importProjects(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedProjects = JSON.parse(e.target.result);
            if (Array.isArray(importedProjects)) {
                projects = importedProjects;
                saveProjects();
                renderProjects();
                showNotification("Projects imported successfully!", "success");
            } else {
                throw new Error("Invalid file format");
            }
        } catch (error) {
            alert("Error importing projects. Please check the file format.");
        }
    };
    reader.readAsText(file);
}

// Global functions for inline event handlers
window.editProject = editProject;
window.deleteProject = deleteProject;
