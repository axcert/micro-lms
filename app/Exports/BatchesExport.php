<?php

namespace App\Exports;

use App\Models\Batch;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BatchesExport implements FromCollection, WithHeadings, WithMapping, WithStyles
{
    protected $teacherId;

    public function __construct($teacherId)
    {
        $this->teacherId = $teacherId;
    }

    public function collection()
    {
        return Batch::where('teacher_id', $this->teacherId)
            ->with(['students', 'classes', 'quizzes'])
            ->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Batch Name',
            'Description',
            'Start Date',
            'End Date',
            'Max Students',
            'Current Students',
            'Status',
            'Classes Count',
            'Quizzes Count',
            'Created At'
        ];
    }

    public function map($batch): array
    {
        return [
            $batch->id,
            $batch->name,
            $batch->description,
            $batch->start_date->format('Y-m-d'),
            $batch->end_date ? $batch->end_date->format('Y-m-d') : 'Ongoing',
            $batch->max_students ?? 'No Limit',
            $batch->students->count(),
            $batch->is_active ? 'Active' : 'Inactive',
            $batch->classes->count(),
            $batch->quizzes->count(),
            $batch->created_at->format('Y-m-d H:i:s')
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}