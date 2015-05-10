package com.witbooking.admin.proxy.filters.pre;

import com.netflix.zuul.ZuulFilter;

/**
 * Created by mongoose on 9/05/15.
 */
public class AuthFilter  extends ZuulFilter {


    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 0;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        /*Using
        * Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        *
        * We can get the auth details
        *
        * I should also do a map or auth static object that
        * maps routes with authorization details
        * the advantage is the centralizations of the auth mecanism
        *
        * which is not half bad for AOP concerns
        *
        * Using the method intender for Preauthorize,
        *
        * I should have complete control of the API calls.
        *
        * Another thing would be to provide security for the
        * API as a whole. what to do then? a separate auth service?
        *
        * 
        * */
        System.out.println("  IM FILTERIIIIIIIIIIIIIIIIIIIIING ");
        return null;
    }
}
