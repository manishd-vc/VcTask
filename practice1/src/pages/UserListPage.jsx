import { useMemo, useState, useCallback } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { toast } from "sonner";
import { AddEditModal } from "../components/AddEditModal";
import { SearchBar } from "../components/SearchBar";
import { UserList } from "../components/UserList";
import { useUsers } from "../hooks/useUsers";

/**
 * Assessment: User directory CRUD against JSONPlaceholder.
 * Page-scoped state (search, modal) lives here; server state stays in useUsers.
 */
export default function UserListPage() {
  const { usersQuery, createMutation, updateMutation, deleteMutation } =
    useUsers();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [addModalCycle, setAddModalCycle] = useState(0);

  const openAddModal = useCallback(() => {
    setEditingUser(null);
    setAddModalCycle((c) => c + 1);
    setModalOpen(true);
  }, []);

  const filteredUsers = useMemo(() => {
    const list = usersQuery.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((u) => (u.name ?? "").toLowerCase().includes(q));
  }, [usersQuery.data, search]);

  const mutationBusy =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  async function handleSave(values) {
    try {
      if (editingUser?.id) {
        await updateMutation.mutateAsync({
          id: editingUser.id,
          payload: values,
        });
        toast.success("User updated successfully");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("User added successfully");
      }
      setModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      toast.error(err?.message ?? "Something went wrong");
      throw err;
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await deleteMutation.mutateAsync(user.id);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err?.message ?? "Delete failed");
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-100 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Users
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage users via JSONPlaceholder (demo API).
            </p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            disabled={usersQuery.isLoading || usersQuery.isError}
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add user
          </button>
        </div>
      </header>

      <main className="mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            disabled={usersQuery.isLoading || usersQuery.isError}
          />
        </div>

        <QueryErrorResetBoundary>
          {({ reset }) => (
            <UserList
              isLoading={usersQuery.isLoading}
              isFetching={usersQuery.isFetching && !usersQuery.isLoading}
              error={usersQuery.isError ? usersQuery.error : null}
              onRetry={() => {
                reset();
                usersQuery.refetch();
              }}
              users={filteredUsers}
              onEdit={(user) => {
                setEditingUser(user);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
              hasActiveSearch={Boolean(search.trim())}
              busy={mutationBusy}
            />
          )}
        </QueryErrorResetBoundary>
      </main>

      <AddEditModal
        key={editingUser ? `edit-${editingUser.id}` : `add-${addModalCycle}`}
        isOpen={modalOpen}
        onClose={() => {
          if (!mutationBusy) {
            setModalOpen(false);
            setEditingUser(null);
          }
        }}
        user={editingUser}
        onSubmit={handleSave}
        isPending={
          editingUser ? updateMutation.isPending : createMutation.isPending
        }
      />
    </div>
  );
}
