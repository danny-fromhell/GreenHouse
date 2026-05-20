export function $(selector) {
  return document.querySelector(selector);
}

export function formatNumber(value) {
  return new Intl.NumberFormat("es-MX").format(value);
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  }).format(value);
}

export function showMessage(container, message, type = "success") {
  if (!container) return;

  container.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;

  setTimeout(() => {
    container.innerHTML = "";
  }, 3000);
}

export function getCurrentPage() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1) || "index.html";
}