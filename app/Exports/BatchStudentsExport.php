<?php

namespace App\Exports;

use App\Models\Batch;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BatchStudentsExport implements FromCollection, WithHeadings, WithMapping
{
    protected $batchId;

    public function __construct($batchId)
    {
        $this->batchId = $batchId;
    }

    public function collection()
    {
        return Batch::find($this->batchId)
            ->students()
            ->withPivot('enrolled_at')
            ->get();
    }

    public function headings(): array
    {
        return [
            'Student ID',
            'Name',
            'Email',
            'Enrolled Date'
        ];
    }

    public function map($student): array
    {
        return [
            $student->id,
            $student->name,
            $student->email,
            $student->pivot->enrolled_at
        ];
    }
}