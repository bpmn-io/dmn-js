export function EditButton({ label, onClick }) {
  return <button
    aria-label={ label }
    type="button"
    className="edit-button dmn-icon-edit"
    onClick={ onClick }
  />;
}
