package com.witbooking.admin.security;

import com.witbooking.admin.domain.Authority;
import com.witbooking.admin.domain.Right;

/**
 * Created by mongoose on 6/04/15.
 * This class extends the role/right based authority by defining a domain Object Identifier (DOI)
 * to which the given authority pertains to. Note that it could be approached as an ACL architecture,
 * however, for the business logic at hand this would be overkill, as there is no need for row-level/object-level
 * authorization for multiple objects, only one type at the moment (Establishments)
 */
public final class EstablishmentGrantedAuthority extends RightGrantedAuthority {

    private String domainObjectIdentifier;

    public String getDomainObjectIdentifier() {
        return domainObjectIdentifier;
    }

    public void setDomainObjectIdentifier(String domainObjectIdentifier) {
        this.domainObjectIdentifier = domainObjectIdentifier;
    }

    public boolean hasAuthority(String authority, String testDomainObjectIdentifier){
        if(testDomainObjectIdentifier.equals(domainObjectIdentifier)){
            return false;
        }
        return super.hasAuthority(authority);
    }

    public boolean hasAuthority(Authority authority, String testDomainObjectIdentifier){
        return this.hasAuthority(authority.getName());
    }

    public boolean hasRight(String right, String testDomainObjectIdentifier){
        if(!testDomainObjectIdentifier.equals(domainObjectIdentifier)){
            return false;
        }
        return super.hasRight(right);
    }

    public boolean hasRight(Right right, String testDomainObjectIdentifier){
        return hasRight(right.getName());
    }


    @Override
    public String getAuthority() {
        return null;
    }
}
