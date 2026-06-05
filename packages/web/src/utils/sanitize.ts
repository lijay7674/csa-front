/**
 * 轻量 HTML 消毒器 — 只允许安全标签和属性通过
 * 用于替代 dompurify，避免额外依赖
 */

const ALLOWED_TAGS = new Set([
  'p', 'br', 'b', 'i', 'em', 'strong', 'u', 's', 'del',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img', 'span', 'div', 'hr', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
]);

const ALLOWED_ATTRS = new Set([
  'href', 'target', 'rel', 'src', 'alt', 'width', 'height',
  'class', 'id', 'style',
]);

const URI_ATTRS = new Set(['href', 'src']);

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../') ||
    trimmed.startsWith('#')
  );
}

export function sanitizeHtml(dirty: string): string {
  const div = document.createElement('div');
  div.innerHTML = dirty;

  function clean(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) return;

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      // 不在白名单的标签：保留文本内容，移除标签
      if (!ALLOWED_TAGS.has(tag)) {
        const fragment = document.createDocumentFragment();
        while (el.firstChild) {
          fragment.appendChild(el.firstChild);
        }
        el.parentNode?.replaceChild(fragment, el);
        // Clean the newly moved children
        fragment.childNodes.forEach(clean);
        return;
      }

      // 移除危险属性
      const attrsToRemove: string[] = [];
      for (let i = 0; i < el.attributes.length; i++) {
        const attr = el.attributes[i];
        const name = attr.name.toLowerCase();

        if (!ALLOWED_ATTRS.has(name)) {
          attrsToRemove.push(name);
          continue;
        }

        // 检查 URL 属性
        if (URI_ATTRS.has(name) && !isSafeUrl(attr.value)) {
          el.removeAttribute(name);
        }
      }
      attrsToRemove.forEach(a => el.removeAttribute(a));

      // 递归处理子节点（用快照避免 live list 问题）
      const children = Array.from(el.childNodes);
      children.forEach(clean);
    }
  }

  clean(div);
  return div.innerHTML;
}
