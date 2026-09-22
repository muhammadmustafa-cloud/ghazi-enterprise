import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AddCategory from '@/views/admin/AddCategory';

export default function Page() {
  return (
    <ProtectedRoute>
      <AddCategory />
    </ProtectedRoute>
  );
}
