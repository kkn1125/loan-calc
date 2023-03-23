import React, { useState, ChangeEvent } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";

interface Column {
  id:
    | "month"
    | "loanOrigin"
    | "creditOrigin"
    | "creditInterest"
    | "creditTotal"
    | "loanCreditTotal"
    | "rest";
  label: string;
  minWidth?: number;
  align?: "left" | "center" | "right";
  format?: (value: number) => string;
}

const columns: Column[] = [
  {
    id: "month",
    label: "개월",
    minWidth: 25,
    align: "center",
    format: (value: number) => value + "개월",
  },
  {
    id: "loanOrigin",
    label: "전세 이자",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "creditOrigin",
    label: "신용 원금",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "creditInterest",
    label: "신용 이자",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "creditTotal",
    label: "신용 원리 합산",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "loanCreditTotal",
    label: "전+신 원리 합산",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
  {
    id: "rest",
    label: "남은 원금",
    minWidth: 100,
    align: "center",
    format: (value: number) => value.toLocaleString("ko") + "원",
  },
];

export default function TableList({
  loan,
  monthly,
}: {
  loan: number;
  monthly: {
    month: number;
    creditOrigin: number;
    creditInterest: number;
    rest: number;
  }[];
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <Paper sx={{ width: "100%" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table aria-label='sticky table'>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: (theme) => theme.palette.primary.main + "56",
              }}>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ top: 57, minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {monthly.length === 0 && (
              <TableRow hover role='checkbox' tabIndex={-1}>
                <TableCell colSpan={columns.length} align={"center"}>
                  내용이 없습니다.
                </TableCell>
              </TableRow>
            )}
            {monthly.length !== 0 &&
              monthly
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      tabIndex={-1}
                      key={i + row.creditOrigin}>
                      {columns.map((column, q) => {
                        const value =
                          column.id === "loanOrigin"
                            ? loan
                            : column.id === "creditTotal"
                            ? row.creditOrigin + row.creditInterest
                            : column.id === "loanCreditTotal"
                            ? loan + row.creditOrigin + row.creditInterest
                            : row[column.id];
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              ...(q === 0 && {
                                backgroundColor: (theme) =>
                                  theme.palette.info.main + "56",
                              }),
                            }}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={monthly.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
