package com.witbooking.admin.security;

import com.witbooking.admin.domain.Authority;
import com.witbooking.admin.domain.Right;
import org.springframework.security.core.GrantedAuthority;

/**
 * Created by mongoose on 6/04/15.
 * This class is used to represent complex granted authorities (not simple string representation)
 * but roles with given rights (lists of rights), that cannot efficiently be expressed as lists of
 * strings.
 */
public class RightGrantedAuthority implements GrantedAuthority {

    private Authority authority;

    public boolean hasRight(Right right){
        return authority.hasRight(right);
    }

    public void setAuthority(Authority authority) {
        this.authority = authority;
    }

    @Override
    public String getAuthority() {
        return null;
    }
}
