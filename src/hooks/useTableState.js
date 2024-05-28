import { useState } from 'react';

export const useTableState = (initialState = {}) => {
  const [sortOrder, setSortOrder] = useState(initialState.sortOrder || 'asc');
  const [searchTerm, setSearchTerm] = useState(initialState.searchTerm || '');
  const [selectedSmevVersion, setSelectedSmevVersion] = useState(
    initialState.selectedSmevVersion || '',
  );
  const [showLockedOnly, setShowLockedOnly] = useState(
    initialState.showLockedOnly || false,
  );
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [visibleColumns, setVisibleColumns] = useState([
    'processName',
    'dateCreated',
    'dateUpDated',
  ]);

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleSelectVersion = version => {
    setSelectedSmevVersion(version);
  };

  const toggleShowLockedOnly = () => {
    setShowLockedOnly(prevState => !prevState);
  };

  const handleColumnToggle = column => {
    setVisibleColumns(prevVisibleColumns => {
      return prevVisibleColumns.includes(column)
        ? prevVisibleColumns.filter(col => col !== column)
        : [...prevVisibleColumns, column];
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return {
    sortOrder,
    toggleSortOrder,
    searchTerm,
    handleSearch,
    selectedSmevVersion,
    handleSelectVersion,
    showLockedOnly,
    toggleShowLockedOnly,
    page,
    handleChangePage,
    rowsPerPage,
    handleChangeRowsPerPage,
    visibleColumns,
    handleColumnToggle,
  };
};
