// Import here your LitElement components (non critical for starting up)

window.loadCellsPage = page => {
if (page==='dashboard') { return import('../pages/dashboard-page/dashboard-page.js'); };
if (page==='help') { return import('../pages/help-page/help-page.js'); };
if (page==='movement-detail') { return import('../pages/movement-detail-page/movement-detail-page.js'); };
}