'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  NavigationMenu as DefaultNavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

const components: Array<{ title: string; href: string }> = [
  {
    title: 'Register Webhooks',
    href: '/',
  },
];

export function NavigationMenu() {
  return (
    <DefaultNavigationMenu aria-label="Main navigation menu">
      <NavigationMenuList>
        {components.map((component) => (
          <NavigationMenuItem key={component.title}>
            <Link href={component.href} legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                {component.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </DefaultNavigationMenu>
  );
}
