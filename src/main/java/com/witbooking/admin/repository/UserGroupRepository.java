package com.witbooking.admin.repository;

import com.witbooking.admin.domain.UserGroup;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the UserGroup entity.
 */
public interface UserGroupRepository extends JpaRepository<UserGroup,Long> {

    @Query("select userGroup from UserGroup userGroup left join fetch userGroup.users where userGroup.id =:id")
    UserGroup findOneWithEagerRelationships(@Param("id") Long id);

}
