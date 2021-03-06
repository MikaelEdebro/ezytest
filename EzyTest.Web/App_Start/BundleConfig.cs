﻿using System.Web.Optimization;

namespace EzyTest.Web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                "~/node_modules/jquery/dist/jquery.js",
                "~/node_modules/bootstrap/dist/js/bootstrap.js",
                "~/UI/bundle/scripts.bundle.js"));

            bundles.Add(new StyleBundle("~/bundles/css").Include(
                "~/node_modules/bootstrap/dist/css/bootstrap.css",
                "~/UI/css/site.css",
                "~/UI/app/exchange-rates/exchange-rates.css",
                "~/UI/app/better-example/better-example.css",
                "~/UI/app/loader/loader.css",
                "~/UI/app/rate-task/rate-task.css",
                "~/UI/app/dashboard/dashboard.css"));
        }
    }
}
