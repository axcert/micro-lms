<?php

namespace App\Enums;

enum QuizStatus: string
{
    case DRAFT = 'draft';
    case ACTIVE = 'active';
    case ARCHIVED = 'archived';
    
    public function label(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::ACTIVE => 'Active',
            self::ARCHIVED => 'Archived',
        };
    }
    
    public function color(): string
    {
        return match($this) {
            self::DRAFT => 'yellow',
            self::ACTIVE => 'green',
            self::ARCHIVED => 'gray',
        };
    }
}