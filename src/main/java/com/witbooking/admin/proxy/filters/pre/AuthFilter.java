package com.witbooking.admin.proxy.filters.pre;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.witbooking.admin.security.RouteAuthorization;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
        * Using the method intended for Preauthorize,
        *
        * I should have complete control of the API calls.
        *
        * Another thing would be to provide security for the
        * API as a whole. what to do then? a separate auth service?
        *
        *
        * */

        RequestContext ctx = RequestContext.getCurrentContext();
        boolean isRequestAuthorized = RouteAuthorization.isAuthorized( SecurityContextHolder.getContext().getAuthentication(), ctx.getRequest().getRequestURI(),ctx.getRequest().getMethod());
        if (!isRequestAuthorized){
            ctx.setSendZuulResponse(false);
            ctx.setResponseStatusCode(403);
        }

        return null;
    }



}
