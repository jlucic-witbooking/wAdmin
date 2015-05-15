package com.witbooking.admin.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by mongoose on 11/05/15.
 */
public class RouteAuthorization {


    /*
    *   ROUTE /bookingPriceRule/{ticker}
    *   METHOD [GET.POST.PUT.UPDATE]
    *   ROLES ADMIN
    *   PERMISSIONS
    */

    private String routeRegex;
    private String httpMethod;
    private List<String> authorities;
    private List<String> rights;

    public RouteAuthorization(String routeRegex, String httpMethod, List<String> rights) {
        this.routeRegex = routeRegex;
        this.httpMethod = httpMethod;
        this.authorities = authorities;
        this.rights = rights;
    }

    public RouteAuthorization(String routeRegex, String httpMethod, List<String> authorities, List<String> rights) {
        this.routeRegex = routeRegex;
        this.httpMethod = httpMethod;
        this.authorities = authorities;
        this.rights = rights;
    }

    public static final List<RouteAuthorization> ROUTE_AUTH;
    static {
        ROUTE_AUTH = Arrays.asList(
            new RouteAuthorization(
                "\\/bookingPriceRule\\/(.+)\\/?$",
                "GET",
                Collections.singletonList("CAN_VIEW_BOOKINGPRICERULES")
            ),
            new RouteAuthorization(
                "\\/bookingPriceRule\\/(.+)\\/.+\\/?$",
                "GET",
                Collections.singletonList("CAN_VIEW_BOOKINGPRICERULES")
            ),
            new RouteAuthorization(
                "\\/bookingPriceRule\\/(.+)\\/?$",
                "POST",
                Collections.singletonList("CAN_CHANGE_BOOKINGPRICERULES")
            ),
            new RouteAuthorization(
                "\\/bookingPriceRule\\/(.+)\\/.+\\/?$",
                "POST",
                Collections.singletonList("CAN_DELETE_BOOKINGPRICERULES")
            )
        );

    }

    public static boolean isAuthorized(Authentication authentication,String route,String method){

        boolean allowed=false;


        for(RouteAuthorization routeAuthorization : ROUTE_AUTH){
            if(!method.equals(routeAuthorization.httpMethod)){
                continue;
            }
            Pattern routePattern = Pattern.compile(routeAuthorization.routeRegex);
            Matcher matcher = routePattern.matcher(route);

            if(!matcher.matches()){
                continue;
            }
            String bookingEngine=null;
            try {
                bookingEngine = matcher.group(1);
            } catch (Exception e) {
                e.printStackTrace();
            }


            if(routeAuthorization.rights!=null && !routeAuthorization.rights.isEmpty()){

                for(String right : routeAuthorization.rights){

                    for(GrantedAuthority grantedAuthority : authentication.getAuthorities()){
                        if (bookingEngine!= null && grantedAuthority instanceof EstablishmentGrantedAuthority){
                            EstablishmentGrantedAuthority roleForEstablishment=((EstablishmentGrantedAuthority) grantedAuthority);
                            if( roleForEstablishment.hasRight(right,bookingEngine) ){
                                allowed|=true;
                            }

                        }else if(bookingEngine== null && grantedAuthority instanceof RightGrantedAuthority){
                            RightGrantedAuthority generalRole=((RightGrantedAuthority) grantedAuthority);
                            if( generalRole.hasRight(right) ){
                                allowed|=true;
                            }
                        }
                    }
                }
            }

            if( routeAuthorization.authorities!=null && !routeAuthorization.authorities.isEmpty()){

                for(String authority : routeAuthorization.authorities){

                    for(GrantedAuthority grantedAuthority : authentication.getAuthorities()){
                        if (bookingEngine!= null && grantedAuthority instanceof EstablishmentGrantedAuthority){
                            EstablishmentGrantedAuthority roleForEstablishment=((EstablishmentGrantedAuthority) grantedAuthority);
                            if( roleForEstablishment.hasAuthority(authority, bookingEngine) ){
                                allowed|=true;
                            }

                        }else if(grantedAuthority instanceof RightGrantedAuthority){
                            RightGrantedAuthority generalRole=((RightGrantedAuthority) grantedAuthority);
                            if( generalRole.hasAuthority(authority) ){
                                allowed|=true;
                            }
                        }
                    }
                }
            }

        }

        return allowed;
    }
}
