import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector:'app-button',
    standalone:true,
    template : `
    <button [ngClass]="buttonClasses" class="px-4 py-2 rounded-md transition-all duration-300 hover:scale-105 focus:outline-none disabled:opacity-50"><ng-content></ng-content></button>
    
    
    `,
    imports:[CommonModule]
})

export class ButtonComponent
{
    @Input() variant : 'primary' | 'secondary' | 'outline' = 'primary';
    @Input() size: 'sm' | 'md' | 'lg' = 'md';

    get buttonClasses()
    {
        const baseClasses = 'font-medium';

        const variantClasses= {
            'primary' : 'bg-primary text-white hover:bg-primary-dark',
            'secondary' : 'bg-secondary text-white hover:bg-secondary-dark',
            'outline' : 'border border-primary text-primary hover:bg-primary'
        };

        const sizeClasses = {
            'sm' : 'text-sm py-1 px-2',
            'md' : 'text-base py-2 px-4',
            'lg' : 'text-lg py-3 px-6'
        }

        return [
            baseClasses,
            variantClasses[this.variant],
            sizeClasses[this.size]
        ].join(' ');
    }
}