"use client"

// import { Status, type TransactionStatus } from "@components/ui/badge"
import { StatusBadge, type GlobalStatus } from "./status-badge"
import { Button } from "@/components/ui/button"
import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from "@/components/ui/popover"
import { Skeleton } from "@/components/ui/skeleton"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type ColumnDef,
	type ColumnFiltersState,
	type Row,
	type SortingState,
	type VisibilityState,
	useReactTable
} from "@tanstack/react-table"
import { ArrowLeft, ArrowRight, Ellipsis } from "lucide-react"
import { useState } from "react"

export const DEFAULT_PAGE_SIZE = 10

type Props<T> = {
	columns: ColumnDef<T>[]
	data: T[]
	onRowClick?: (row: Row<T>) => void
	defaultVisibility?: Record<string, boolean>
	loading?: boolean
	tableAction?: Array<{
		label: string
		onClick: (row: Row<T>) => void
	}>
	pagination?: {
		pageIndex: number
		pageSize: number
		rowCount: number
		onPageChange: (pageIndex: number) => void
		onPageSizeChange?: (pageSize: number) => void
		onMouseEnter?: () => void
	}
}

export default function DataGrid<T>({
	defaultVisibility,
	columns,
	data,
	onRowClick,
	loading = false,
	pagination,
	tableAction
}: Props<T>) {
	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		defaultVisibility || {}
	)
	const [rowSelection, setRowSelection] = useState({})
	const [internalPagination, setInternalPagination] = useState({
		pageIndex: 0,
		pageSize: DEFAULT_PAGE_SIZE
	})

	const isExternal = !!pagination
	const pageCount = isExternal
		? Math.ceil(pagination.rowCount / pagination.pageSize)
		: Math.ceil(data.length / internalPagination.pageSize)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualPagination: isExternal,
		pageCount: isExternal ? pageCount : undefined,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			pagination: isExternal ? pagination : internalPagination
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		onPaginationChange: (updater) => {
			if (isExternal) {
				if (typeof updater === "function") {
					const newState = updater({
						pageIndex: pagination.pageIndex - 1,
						pageSize: pagination.pageSize
					})
					pagination.onPageChange(newState.pageIndex + 1)
					pagination.onPageSizeChange?.(newState.pageSize)
				} else {
					pagination.onPageChange(updater.pageIndex + 1)
					pagination.onPageSizeChange?.(updater.pageSize)
				}
			} else {
				setInternalPagination((old) =>
					typeof updater === "function" ? updater(old) : updater
				)
			}
		}
	})

	return (
		<div className="w-full overflow-x-auto">
			<Table>
				<TableHeader className="bg-muted">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="whitespace-nowrap text-sm font-medium"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{loading ? (
						Array.from({ length: 5 }).map((_, index) => (
							<TableRow key={index}>
								{columns.map((_, colIdx) => (
									<TableCell key={colIdx}>
										<Skeleton className="h-5 w-full" />
									</TableCell>
								))}
							</TableRow>
						))
					) : table.getRowModel().rows?.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className={cn(
									"cursor-default",
									onRowClick && "cursor-pointer hover:bg-muted/50",
									row.getIsSelected() && "bg-muted"
								)}
								onClick={() => onRowClick?.(row)}
							>
								{row.getVisibleCells().map((cell) => {
									const thead = cell.column.columnDef.header
									if (thead === "Status") {
										return (
											<TableCell key={cell.id}>
												<StatusBadge
													key={cell.id}
													status={cell.getValue() as GlobalStatus}
													dot
												/>
											</TableCell>
										)
									} else if (thead === "Action") {
										return (
											<TableCell key={cell.id} className="text-right">
												<Popover>
													<PopoverTrigger asChild>
														<Button variant="ghost" size="sm">
															<Ellipsis size={18} />
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-28 p-1">
														{tableAction?.map((action) => (
															<Button
																key={action.label}
																variant="ghost"
																size="sm"
																className="w-full justify-start text-xs"
																onClick={() =>
																	action.onClick(cell.row as Row<T>)
																}
															>
																{action.label}
															</Button>
														))}
													</PopoverContent>
												</Popover>
											</TableCell>
										)
									} else {
										return (
											<TableCell
												key={cell.id}
												className="whitespace-nowrap px-4 py-2 text-sm font-medium text-foreground"
											>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										)
									}
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="text-center py-10">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			<div className="flex items-center justify-between gap-3 px-4 py-3">
				<p className="text-sm">
					Page {table.getState().pagination.pageIndex} of {pageCount}
				</p>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage() || loading}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						onMouseEnter={() => pagination?.onMouseEnter?.()}
						disabled={!table.getCanNextPage() || loading}
					>
						Next
						<ArrowRight className="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
