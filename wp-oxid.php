<?php

/*
Plugin Name: ProudCommerce WP OXID Plugin
Plugin URI: https://www.proudcommerce.com
Description: Dieses Plugin verbindet den OXID eShop über GraphQL mit Wordpress.
Author: Stefan Moises <beffy@proudcommerce.com>
Author URI: https://www.proudcommerce.com
Version: 1.0.0
*/
if (! defined('WPINC')) {
    die;
}
/**
 * Add our HTML to the WP source
 *
 * @param string $content
 * @return string
 */
function pc_oxid_productbox($content)
{
    $pc_oxid_productbox = '';
    if (is_single()) {
        $pc_oxid_productbox .= '<h3>Hello, World from ProudCommerce Webcomponents!</h3>';
        // add our webcomponents!
        $pc_oxid_productbox .= '<div><pc-oxid-productbox></pc-oxid-productbox></div>';
        $pc_oxid_productbox .= '<pc-oxid-basket id="wp-oxid-basket"></pc-oxid-basket>';
    }
    $content .= $pc_oxid_productbox;
    return $content;
}
add_filter('the_content', 'pc_oxid_productbox');

/**
 * Add CSS and JS to WP source
 *
 * @return void
 */
function pc_oxid_css()
{
    wp_enqueue_style('pc-oxid-style', plugin_dir_url(__FILE__) . 'resources/css/pc-oxid.css');
    wp_enqueue_script('pc-oxid-productbox', plugin_dir_url(__FILE__) . 'resources/js/pc-oxid-productbox.js');
    wp_enqueue_script('pc-oxid-basket', plugin_dir_url(__FILE__) . 'resources/js/pc-oxid-basket.js');
    wp_enqueue_script('pc-oxid-main', plugin_dir_url(__FILE__) . 'resources/js/pc-oxid-main.js');
}
add_action('wp_enqueue_scripts', 'pc_oxid_css');

/**
 * Add "type=module" to our script(s)
 *
 * @param string $tag
 * @param string $handle
 * @param string $src
 * @return string
 */
function add_type_attribute($tag, $handle, $src)
{
    // if not our script, do nothing and return original $tag
    if (strpos($handle, 'pc-oxid-') === false) {
        return $tag;
    }
    // change the script tag by adding type="module" and return it
    $tag = '<script type="module" src="' . esc_url($src) . '"></script>';
    return $tag;
}
add_filter('script_loader_tag', 'add_type_attribute', 10, 3);
