import ProtectedRoute from '@/components/admin/ProtectedRoute';
import AdminDashboard from '@/views/admin/AdminDashboard';

export default function Page() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
