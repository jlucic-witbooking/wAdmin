package com.witbooking.admin.repository;

import com.witbooking.admin.domain.FrontEndMessage;
import org.springframework.data.jpa.repository.*;

import java.util.List;

/**
 * Spring Data JPA repository for the FrontEndMessage entity.
 */
public interface FrontEndMessageRepository extends JpaRepository<FrontEndMessage,Long> {

}
